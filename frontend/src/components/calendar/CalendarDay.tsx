import React from 'react';

interface Event {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string; // Added category property
}

interface Day {
  day: number;
  date: Date;
  events: Event[];
}

interface CalendarDayProps {
  day: Day | null;
  onClick?: () => void;
  isToday: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, onClick, isToday }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Work':
        return 'bg-sky-500 dark:bg-sky-600';
      case 'Personal':
        return 'bg-emerald-500 dark:bg-emerald-600';
      case 'Health':
        return 'bg-teal-500 dark:bg-teal-600';
      case 'Learning':
        return 'bg-amber-500 dark:bg-amber-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  if (!day) {
    return <div className="bg-slate-50 dark:bg-slate-900/60 min-h-30"></div>;
  }

  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 min-h-30 p-2 transition-colors duration-200 ${
        onClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800' : ''
      }`}
    >
      <div className="flex justify-end">
        <span className={`
          text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full
          ${isToday 
            ? 'bg-sky-600 text-white' 
            : 'text-slate-700 dark:text-slate-300'
          }
        `}>
          {day.day}
        </span>
      </div>
      
      <div className="mt-2 space-y-1 max-h-20 overflow-hidden">
        {day.events.slice(0, 3).map((event) => (
          <div 
            key={event.id}
            className={`px-2 py-1 text-xs text-white rounded truncate ${getCategoryColor(event.category)}`}
          >
            {event.startTime} {event.title}
          </div>
        ))}
        
        {day.events.length > 3 && (
          <div className="text-xs text-slate-500 dark:text-slate-400 pl-2">
            +{day.events.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;