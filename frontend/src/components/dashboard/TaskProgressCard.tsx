import React from 'react';

interface TaskProgressCardProps {
  name: string;
  completed: number;
  total: number;
  color: string;
}

const TaskProgressCard: React.FC<TaskProgressCardProps> = ({ name, completed, total, color }) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  return (
    <div className="card-soft rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-slate-900 dark:text-white">{name}</h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">{completed}/{total} tasks</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 mb-2">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-right">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{percentage}%</span>
      </div>
    </div>
  );
};

export default TaskProgressCard;