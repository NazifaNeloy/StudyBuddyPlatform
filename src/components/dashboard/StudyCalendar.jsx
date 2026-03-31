import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const StudyCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-heading font-black italic tracking-tighter">
          {format(currentMonth, 'MMM yyyy')}
        </h3>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="w-10 h-10 border border-black/5 text-gray-300 hover:text-brand-black hover:bg-gray-50 rounded-xl flex items-center justify-center transition-all shadow-sm active:translate-y-1"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
           onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="w-10 h-10 bg-[#F4E46B] border border-black/5 text-brand-black hover:bg-brand-black hover:text-white rounded-xl flex items-center justify-center transition-all shadow-md active:translate-y-1"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const daysArr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return (
      <div className="grid grid-cols-7 mb-4 px-2">
        {daysArr.map(day => (
          <div key={day} className="text-[10px] font-black text-brand-black uppercase tracking-widest text-center italic">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    return (
      <div className="grid grid-cols-7 gap-y-2">
        {days.map((day, i) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const hasActivity = i % 5 === 0;

          return (
            <div 
              key={day.toString()} 
              className="flex flex-col items-center justify-center group relative h-14 cursor-pointer"
              onClick={() => setSelectedDate(day)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all relative z-10 ${
                isSelected 
                  ? 'bg-[#F4E46B] text-brand-black shadow-md border border-black/5 scale-110' 
                  : isCurrentMonth ? 'text-brand-black hover:bg-gray-50' : 'text-gray-100'
              }`}>
                {format(day, 'd')}
              </div>
              
              {/* Density Indicator */}
              {hasActivity && !isSelected && (
                <div className="absolute bottom-1 w-1.5 h-1.5 bg-brand-purple rounded-full shadow-sm" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-ref-xl transition-all border border-black/5">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default StudyCalendar;
