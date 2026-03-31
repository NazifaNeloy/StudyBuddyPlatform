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

const CalendarGrid = ({ events = [], viewDate = new Date() }) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const generateDays = () => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);
    // Start of the week for the calendar grid (Monday start)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarInterval = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return calendarInterval.map(day => {
      const taskForDay = events.find(e => isSameDay(new Date(e.due_date), day));
      const today = new Date();

      return {
        date: day,
        day: day.getDate(),
        isToday: isSameDay(day, today),
        isPrevMonth: !isSameMonth(day, monthStart),
        isWeekend: day.getDay() === 0 || day.getDay() === 6,
        event: taskForDay ? {
          title: taskForDay.title,
          color: taskForDay.category || ['primary', 'secondary', 'tertiary', 'error'][Math.floor(Math.random() * 4)]
        } : null
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
      {/* Weekdays Header */}
      <div className="grid grid-cols-7 border-b border-outline-variant/10 bg-white/50">
        {weekDays.map(day => (
          <div key={day} className={`py-4 text-center font-label font-bold text-[10px] uppercase tracking-widest ${day === 'Sat' || day === 'Sun' ? 'text-secondary' : 'text-on-surface-variant opacity-60'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Grid Cells */}
      <div className="grid grid-cols-7 auto-rows-[140px] bg-white">
        {days.map((item, idx) => (
          <div 
            key={idx}
            className={`p-3 flex flex-col gap-2 border-r border-b border-outline-variant/10 transition-colors group relative ${item.isPrevMonth ? 'bg-surface/30 opacity-30' : 'bg-surface-container-lowest hover:bg-primary/5'} ${item.isToday ? 'ring-2 ring-primary ring-inset z-10' : ''}`}
          >
            {item.isToday && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-sm z-20">
                Today
              </div>
            )}

            <span className={`font-headline font-bold text-sm self-end ${item.isToday ? 'text-primary' : 'text-on-surface'}`}>
              {item.day}
            </span>

            {item.event && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${styleMap[item.event.color].bg} border-l-4 ${styleMap[item.event.color].border} p-1.5 rounded-r-md mt-auto shadow-sm`}
              >
                <p className={`text-[9px] font-label font-black ${styleMap[item.event.color].text} truncate tracking-tighter uppercase italic`}>
                  {item.event.title}
                </p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
