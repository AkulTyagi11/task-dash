import React from 'react';
import { Check, X, Clock, AlertCircle, Circle } from 'lucide-react';
import { Task } from '../../types/task';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
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

  const formatDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleDateString();
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task._id ?? task.id ?? task.title}
          className={`p-3 rounded-2xl border ${
            task.completed
              ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          } transition-all duration-200 hover:shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                className={`shrink-0 w-5 h-5 rounded-full border ${
                  task.completed
                    ? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600 flex items-center justify-center'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {task.completed && <Check className="w-3 h-3 text-white" />}
              </button>
              <div className="flex flex-col">
                <span
                  className={`font-medium ${
                    task.completed
                      ? 'text-slate-500 dark:text-slate-400 line-through'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {task.title}
                </span>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(task.date)}
                  </span>
                  <div className="flex items-center" title={`Priority: ${task.priority}`}>
                    {getPriorityIcon(task.priority)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-1">
              <button className="p-1 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;