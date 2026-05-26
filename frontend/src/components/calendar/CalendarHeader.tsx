import React from 'react';

interface CalendarHeaderProps {
  weekdays: string[];
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ weekdays }) => {
  return (
    <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800">
      {weekdays.map((day, index) => (
        <div 
          key={index}
          className="bg-slate-100 dark:bg-slate-900 text-center py-2 text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export default CalendarHeader;