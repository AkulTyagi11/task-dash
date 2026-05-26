import React from 'react';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, role, content, avatar }) => {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="card-soft p-6 rounded-3xl transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center mb-4">
        {avatar ? (
          <img 
            src={avatar} 
            alt={name} 
            className="w-12 h-12 rounded-full object-cover mr-4" 
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-sky-500 to-emerald-400 text-white font-semibold flex items-center justify-center mr-4">
            {initials}
          </div>
        )}
        <div>
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{name}</h4>
          <p className="text-slate-600 dark:text-slate-300 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-slate-700 dark:text-slate-200 italic">"{content}"</p>
    </div>
  );
};

export default TestimonialCard;