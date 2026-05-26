import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task } from '../../types/task';

type NewTaskInput = Omit<Task, 'id' | '_id'>;

interface NewTaskModalProps {
  onClose: () => void;
  onSave: (task: NewTaskInput) => void;
  initialTask?: Task;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ onClose, onSave, initialTask }) => {
  const defaultDate = new Date().toISOString().split('T')[0];
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>(initialTask?.priority ?? 'medium');
  const [date, setDate] = useState(() => {
    if (initialTask?.date) {
      const parsedDate = new Date(initialTask.date);
      return Number.isNaN(parsedDate.getTime()) ? defaultDate : parsedDate.toISOString().split('T')[0];
    }
    return defaultDate;
  });
  const [category, setCategory] = useState(initialTask?.category ?? 'Work');

  const isEditMode = Boolean(initialTask);

  useEffect(() => {
    if (!initialTask) return;

    setTitle(initialTask.title ?? '');
    setDescription(initialTask.description ?? '');
    setPriority(initialTask.priority ?? 'medium');
    setCategory(initialTask.category ?? 'Work');
    if (initialTask.date) {
      const parsedDate = new Date(initialTask.date);
      setDate(Number.isNaN(parsedDate.getTime()) ? defaultDate : parsedDate.toISOString().split('T')[0]);
    }
  }, [initialTask, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const newTask: NewTaskInput = {
      title,
      description,
      completed: initialTask?.completed ?? false,
      priority,
      date,
      category,
    };
    
    onSave(newTask);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          {isEditMode ? 'Edit Task' : 'Add New Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Task Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 dark:bg-slate-800 dark:text-white"
              placeholder="What needs to be done?"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 dark:bg-slate-800 dark:text-white"
              placeholder="Add details about this task..."
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Due Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 dark:bg-slate-800 dark:text-white"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Learning">Learning</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Priority
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                  priority === 'low'
                    ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300 border-2 border-sky-500'
                    : 'bg-sky-50 dark:bg-sky-900/10 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/20'
                }`}
              >
                Low
              </button>
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                  priority === 'medium'
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-2 border-amber-500'
                    : 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/20'
                }`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                  priority === 'high'
                    ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border-2 border-rose-500'
                    : 'bg-rose-50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/20'
                }`}
              >
                High
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-sky-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 text-white rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              {isEditMode ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;