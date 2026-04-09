import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  format 
} from 'date-fns';
import { motion } from 'framer-motion';

const CalendarGrid = ({ events = [], viewDate = new Date(), view = 'Month' }) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const generateDays = () => {
    let startDate, endDate;
    
    if (view === 'Month') {
      const monthStart = startOfMonth(viewDate);
      const monthEnd = endOfMonth(viewDate);
      startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
      endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    } else if (view === 'Week') {
      startDate = startOfWeek(viewDate, { weekStartsOn: 1 });
      endDate = endOfWeek(viewDate, { weekStartsOn: 1 });
    } else {
      startDate = viewDate;
      endDate = viewDate;
    }

    const calendarInterval = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    const monthStart = startOfMonth(viewDate);

    return calendarInterval.map(day => {
      const tasksForDay = events.filter(e => isSameDay(new Date(e.due_date), day));
      const today = new Date();

      return {
        date: day,
        day: day.getDate(),
        isToday: isSameDay(day, today),
        isPrevMonth: !isSameMonth(day, monthStart),
        isWeekend: day.getDay() === 0 || day.getDay() === 6,
        events: tasksForDay.map(taskForDay => ({
          title: taskForDay.title,
          color: taskForDay.category || ['primary', 'secondary', 'tertiary', 'error'][Math.floor(Math.random() * 4)]
        }))
      };
    });
  };

  const days = generateDays();

  const styleMap = {
    'primary': { bg: 'bg-primary-container/20', border: 'border-primary', text: 'text-on-primary-container' },
    'secondary': { bg: 'bg-secondary-container/30', border: 'border-secondary', text: 'text-on-secondary-container' },
    'error': { bg: 'bg-error-container/20', border: 'border-error', text: 'text-error' },
    'tertiary': { bg: 'bg-tertiary-container/30', border: 'border-tertiary', text: 'text-on-tertiary-container' }
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-1 overflow-hidden border border-outline-variant/10 shadow-ref-sm">
      {/* Weekdays Header - Hide in Day view */}
      {view !== 'Day' && (
        <div className="grid grid-cols-7 border-b border-outline-variant/10 bg-white/50">
          {weekDays.map(day => (
            <div key={day} className={`py-4 text-center font-label font-bold text-[10px] uppercase tracking-widest ${day === 'Sat' || day === 'Sun' ? 'text-secondary' : 'text-on-surface-variant opacity-60'}`}>
              {day}
            </div>
          ))}
        </div>
      )}

      {/* Grid Cells */}
      <div className={`grid ${view === 'Day' ? 'grid-cols-1 auto-rows-[minmax(200px,auto)]' : 'grid-cols-7 auto-rows-[120px] sm:auto-rows-[140px]'} bg-white`}>
        {days.map((item, idx) => (
          <div 
            key={idx}
            className={`p-3 flex flex-col gap-2 border-r border-b border-outline-variant/10 transition-colors group relative ${item.isPrevMonth && view === 'Month' ? 'bg-surface/30 opacity-30' : 'bg-surface-container-lowest hover:bg-primary/5'} ${item.isToday ? 'ring-2 ring-primary ring-inset z-10' : ''}`}
          >
            <div className="flex justify-between items-start">
              <span className={`font-headline font-bold text-sm ${item.isToday ? 'text-primary' : 'text-on-surface'}`}>
                {item.day} {view === 'Day' && format(item.date, 'MMMM')}
              </span>
              {item.isToday && (
                <div className="bg-primary text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-sm">
                  Today
                </div>
              )}
            </div>

            <div className={`flex flex-col gap-2 ${view === 'Day' ? 'mt-4' : 'mt-auto'}`}>
              {item.events.map((event, eventIdx) => (
                <motion.div 
                  key={eventIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`${styleMap[event.color]?.bg || 'bg-primary-container/20'} border-l-4 ${styleMap[event.color]?.border || 'border-primary'} p-1.5 rounded-r-md shadow-sm`}
                >
                  <p className={`text-[9px] sm:text-[10px] font-label font-black ${styleMap[event.color]?.text || 'text-primary'} truncate tracking-tighter uppercase italic`}>
                    {event.title}
                  </p>
                </motion.div>
              ))}
              {item.events.length === 0 && view === 'Day' && (
                <div className="text-center py-10 opacity-20 italic font-black text-xs uppercase tracking-widest">
                  No Protocols Scheduled for this temporal coordinate
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
