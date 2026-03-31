import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, MoreHorizontal, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const TaskWidget = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(7);
    
    if (data) setTasks(data);
    setLoading(false);
  };

  const toggleTask = async (task) => {
    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: !task.is_completed })
      .eq('id', task.id);
    
    if (!error) {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, is_completed: !t.is_completed } : t));
    }
  };

  const pastelRowColors = ['bg-pastel-yellow', 'bg-pastel-blue', 'bg-pastel-pink', 'bg-pastel-green'];

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-ref-xl h-full flex flex-col transition-all border border-black/5">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-heading font-black italic uppercase tracking-tighter text-brand-black">
          My Tasks <span className="text-brand-purple italic ml-1 text-lg">({tasks.length.toString().padStart(2, '0')})</span>
        </h3>
        <button className="p-2 border border-black/5 hover:bg-gray-50 rounded-xl transition-all text-gray-300 hover:text-brand-black">
           <MoreHorizontal size={24} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide">
        {tasks.map((task, i) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between group cursor-pointer border border-transparent hover:border-black/5 hover:bg-gray-50 rounded-2xl p-4 transition-all"
            onClick={() => toggleTask(task)}
          >
            <div className="flex items-center gap-6">
              <div className={`w-10 h-10 rounded-xl border border-black/5 flex items-center justify-center font-black text-xs shadow-sm ${pastelRowColors[i % 4]}`}>
                {(i + 1).toString().padStart(2, '0')}
              </div>
              <span className={`text-base font-black italic tracking-tighter transition-all ${
                task.is_completed 
                  ? 'text-gray-200 line-through decoration-[2.5px] decoration-pastel-green/40' 
                  : 'text-brand-black group-hover:text-brand-purple'
              }`}>
                {task.title}
              </span>
            </div>
            
            <div className={`w-9 h-9 rounded-xl border border-black/5 flex items-center justify-center transition-all shadow-sm ${
              task.is_completed 
                ? 'bg-pastel-green' 
                : 'bg-white group-hover:bg-pastel-yellow'
            }`}>
              {task.is_completed ? <CheckCircle2 size={20} className="text-brand-black" /> : <Circle size={20} className="text-brand-black opacity-0 group-hover:opacity-100" />}
            </div>
          </motion.div>
        ))}

        {tasks.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-10">
            <Plus size={40} className="mb-2 text-brand-black" />
            <p className="font-black italic uppercase tracking-widest text-[11px]">No Protocols Logged</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskWidget;
