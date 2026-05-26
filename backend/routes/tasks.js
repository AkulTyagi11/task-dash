import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

const allowedPriorities = new Set(['low', 'medium', 'high']);
const allowedCategories = new Set(['Work', 'Personal', 'Health', 'Learning', 'Other']);

const parseDateValue = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const validateTaskPayload = (payload, options = {}) => {
  const errors = [];
  const data = {};
  const { requireTitle = false, requireDate = false } = options;

  if (payload.title !== undefined) {
    const trimmed = String(payload.title).trim();
    if (!trimmed) {
      errors.push('Title cannot be empty');
    } else if (trimmed.length > 120) {
      errors.push('Title must be 120 characters or fewer');
    } else {
      data.title = trimmed;
    }
  } else if (requireTitle) {
    errors.push('Title is required');
  }

  if (payload.description !== undefined) {
    const trimmed = String(payload.description).trim();
    if (trimmed.length > 2000) {
      errors.push('Description must be 2000 characters or fewer');
    } else {
      data.description = trimmed;
    }
  }

  if (payload.priority !== undefined) {
    if (!allowedPriorities.has(payload.priority)) {
      errors.push('Priority must be low, medium, or high');
    } else {
      data.priority = payload.priority;
    }
  }

  if (payload.category !== undefined) {
    if (!allowedCategories.has(payload.category)) {
      errors.push('Category is invalid');
    } else {
      data.category = payload.category;
    }
  }

  if (payload.completed !== undefined) {
    if (typeof payload.completed !== 'boolean') {
      errors.push('Completed must be a boolean');
    } else {
      data.completed = payload.completed;
    }
  }

  if (payload.date !== undefined) {
    const parsedDate = parseDateValue(payload.date);
    if (!parsedDate) {
      errors.push('Date must be a valid ISO date');
    } else {
      data.date = parsedDate;
    }
  } else if (requireDate) {
    errors.push('Date is required');
  }

  return { data, errors };
};

router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid task id' });
  }
  return next();
});

// @route   GET /api/tasks
// @desc    Get all tasks for the authenticated user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get a single task by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Error fetching task' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { data, errors } = validateTaskPayload(req.body, {
      requireTitle: true,
      requireDate: true
    });

    if (errors.length) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const task = await Task.create({
      user: req.user._id,
      ...data,
      completed: false
    });
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { data, errors } = validateTaskPayload(req.body);

    if (errors.length) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.set(data);
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully', task });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

// @route   PATCH /api/tasks/:id/toggle
// @desc    Toggle task completion status
// @access  Private
router.patch('/:id/toggle', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    task.completed = !task.completed;
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({ error: 'Error toggling task' });
  }
});

export default router;
