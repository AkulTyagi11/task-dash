import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ListChecks } from 'lucide-react';
import TaskItem from '../components/tasks/TaskItem';
import NewTaskModal from '../components/tasks/NewTaskModal';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../utils/api';
import { Task } from '../types/task';

const Tasks: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Check authentication
    useEffect(() => {
      if (!authLoading && !isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, authLoading, navigate]);

    // Fetch tasks from backend
    useEffect(() => {
      const fetchTasks = async () => {
        if (!isAuthenticated) return;
      
        try {
          setIsLoading(true);
          const fetchedTasks = await taskAPI.getAllTasks();
          const tasksWithId: Task[] = fetchedTasks.map((task) => ({
            ...task,
            id: task._id ?? task.id
          }));
          setTasks(tasksWithId);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTasks();
    }, [isAuthenticated]);

    const toggleTaskCompletion = async (taskId: string) => {
      const taskToUpdate = tasks.find(t => t.id === taskId || t._id === taskId);
      const resolvedId = taskToUpdate?._id ?? taskToUpdate?.id;
      if (!resolvedId) return;

      try {
        const updatedTask = await taskAPI.toggleTask(resolvedId);
        const normalizedTask: Task = { ...updatedTask, id: updatedTask._id ?? updatedTask.id };
          setTasks((prev) => prev.map(task =>
            (task.id === taskId || task._id === taskId) 
              ? normalizedTask
              : task
          ));
      } catch (error) {
        console.error('Error toggling task:', error);
      }
    };

    const deleteTask = async (taskId: string) => {
      const taskToDelete = tasks.find(t => t.id === taskId || t._id === taskId);
      const resolvedId = taskToDelete?._id ?? taskToDelete?.id;
      if (!resolvedId) return;

      try {
        await taskAPI.deleteTask(resolvedId);
          setTasks((prev) => prev.filter(task => task.id !== taskId && task._id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };

    const addTask = async (newTask: Omit<Task, 'id' | '_id'>) => {
      try {
        const createdTask = await taskAPI.createTask({
          ...newTask,
          completed: false
        });
        const normalizedTask: Task = { ...createdTask, id: createdTask._id ?? createdTask.id };
          setTasks((prev) => [normalizedTask, ...prev]);
      } catch (error) {
        console.error('Error creating task:', error);
      }
    };

    const updateTask = async (updatedTask: Omit<Task, 'id' | '_id'>) => {
      if (!editingTask) return;

      const resolvedId = editingTask._id ?? editingTask.id;
      if (!resolvedId) return;

      try {
        const updated = await taskAPI.updateTask(resolvedId, {
          title: updatedTask.title,
          description: updatedTask.description,
          priority: updatedTask.priority,
          category: updatedTask.category,
          date: updatedTask.date,
          completed: updatedTask.completed
        });
        const normalizedTask: Task = { ...updated, id: updated._id ?? updated.id };
          setTasks((prev) => prev.map(task =>
            (task.id === resolvedId || task._id === resolvedId) ? normalizedTask : task
          ));
        setEditingTask(null);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    };

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'incomplete') return !task.completed;
      return true;
    })
    .filter(task => {
      if (categoryFilter !== 'all') return task.category === categoryFilter;
      return true;
    })
    .filter(task => {
      if (searchQuery) {
        return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return true;
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600 dark:text-gray-400">Loading tasks...</div>
            </div>
          ) : (
            <>
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 md:mb-0">Tasks</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-6 p-4 border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10 pr-3 py-2 w-full border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-2 rounded-full text-sm font-medium ${filter === 'all'
                    ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('incomplete')}
                className={`px-3 py-2 rounded-full text-sm font-medium ${filter === 'incomplete'
                    ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                To Do
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-2 rounded-full text-sm font-medium ${filter === 'completed'
                    ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                Completed
              </button>
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 dark:bg-slate-800 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Learning">Learning</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white">Task List</h2>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {filteredTasks.filter(t => !t.completed).length} remaining
            </div>
          </div>

          {filteredTasks.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTasks.map((task) => {
                const taskIdentifier = task._id ?? task.id;
                const key = taskIdentifier ?? task.title;

                return (
                  <TaskItem
                    key={key}
                    task={task}
                    onToggle={() => {
                      if (taskIdentifier) toggleTaskCompletion(taskIdentifier);
                    }}
                    onDelete={() => {
                      if (taskIdentifier) deleteTask(taskIdentifier);
                    }}
                    onEdit={() => {
                      setEditingTask(task);
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center text-slate-500 dark:text-slate-400">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <ListChecks className="h-6 w-6" />
              </div>
              {tasks.length === 0 ? 'No tasks yet. Create your first task to get started!' : 'No tasks match your filters.'}
            </div>
          )}
        </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <NewTaskModal
          onClose={() => setIsModalOpen(false)}
          onSave={(task) => {
            addTask(task);
            setIsModalOpen(false);
          }}
        />
      )}

      {editingTask && (
        <NewTaskModal
          initialTask={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(task) => {
            updateTask(task);
          }}
        />
      )}
    </div>
  );
};

export default Tasks;