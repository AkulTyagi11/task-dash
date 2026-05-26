import React, { useState } from 'react';
import { Check, AlertCircle, Clock, Circle, MoreVertical, Trash, Edit } from 'lucide-react';
import { Task } from '../../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
      case 'low':
        return <Circle className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Work':
        return 'bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300';
      case 'Personal':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300';
      case 'Health':
        return 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300';
      case 'Learning':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300';
    }
  };

  const getDueStatus = () => {
    if (task.completed) return null;
    const parsedDate = new Date(task.date);
    if (Number.isNaN(parsedDate.getTime())) return null;

    const diff = parsedDate.getTime() - Date.now();
    const twoDaysMs = 48 * 60 * 60 * 1000;

    if (diff < 0) {
      return { label: 'Overdue', className: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200' };
    }

    if (diff <= twoDaysMs) {
      return { label: 'Due soon', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200' };
    }

    return null;
  };

  const dueStatus = getDueStatus();

  return (
    <div className={`p-4 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-900/60 ${
      task.completed ? 'bg-slate-50 dark:bg-slate-900/70' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 grow min-w-0" onClick={() => task.description && setShowDescription(!showDescription)}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`shrink-0 w-5 h-5 mt-1 rounded-full border ${
              task.completed
                ? 'bg-emerald-500 border-emerald-500 dark:bg-emerald-600 dark:border-emerald-600 flex items-center justify-center'
                : 'border-slate-300 dark:border-slate-600'
            }`}
          >
            {task.completed && <Check className="w-3 h-3 text-white" />}
          </button>
          
          <div className="flex flex-col grow min-w-0">
            <div className="flex items-start">
              <span
                className={`font-medium mr-2 ${
                  task.completed
                    ? 'text-slate-500 dark:text-slate-400 line-through'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {task.title}
              </span>
            </div>
            
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(task.date).toLocaleDateString()}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(task.category)}`}
              >
                {task.category}
              </span>
              <div className="flex items-center" title={`Priority: ${task.priority}`}>
                {getPriorityIcon(task.priority)}
              </div>
              {dueStatus && (
                <span className={`text-xs px-2 py-0.5 rounded ${dueStatus.className}`}>
                  {dueStatus.label}
                </span>
              )}
              {task.description && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDescription(!showDescription);
                  }}
                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
                >
                  {showDescription ? 'Hide details' : 'Show details'}
                </button>
              )}
            </div>
            
            {showDescription && task.description && (
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                {task.description}
              </div>
            )}
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
              <button
                className="flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onEdit) {
                    onEdit();
                  }
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Task
              </button>
              <button
                className="flex w-full items-center px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete();
                }}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;