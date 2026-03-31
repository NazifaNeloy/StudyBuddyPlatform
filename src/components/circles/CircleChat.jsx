import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CircleChat = ({ messages, newMessage, onMessageChange, onSendMessage, scrollRef }) => {
  return (
    <div className="bg-surface-container-lowest rounded-[3rem] shadow-ref-xl flex flex-col h-full overflow-hidden border border-outline-variant/10 group">
      <div className="p-8 border-b border-outline-variant/10 bg-white/70 backdrop-blur-xl flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pastel-purple rounded-2xl flex items-center justify-center text-primary shadow-sm border border-outline-variant/5">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>message</span>
          </div>
          <div>
            <h3 className="font-headline font-black italic text-lg uppercase tracking-tighter text-on-surface">Circle Chat</h3>
            <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(71,59,228,0.4)]"></span>
               <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Neural Sync Active</p>
            </div>
          </div>
        </div>
        <button className="p-3 text-on-surface-variant hover:text-primary transition-all hover:bg-gray-50 rounded-xl">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-8 space-y-8 bg-surface-container-low/20 scroll-smooth pr-6 scrollbar-hide" 
        ref={scrollRef}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMe = msg.isMe; // Logic to be passed from parent
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex flex-col ${isMe ? 'items-end ml-12' : 'items-start mr-12'}`}
              >
                <div className={`flex items-center gap-3 mb-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                   {!isMe && <div className="w-6 h-6 rounded-full bg-surface-container-high overflow-hidden shadow-sm border border-white"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user_name}`} alt="P" /></div>}
                   <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 italic">{msg.user_name} • {msg.time}</span>
                </div>
                <div className={`px-6 py-4 rounded-[1.8rem] text-sm font-bold shadow-sm border-l-4 ${
                  isMe 
                    ? 'bg-primary text-white border-primary-container rounded-tr-none' 
                    : 'bg-white text-on-surface border-pastel-purple rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Typist Indicator */}
        <div className="flex items-center gap-3 pt-2 opacity-40 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant italic">Jordan is typing...</span>
        </div>
      </div>

      <div className="p-8 border-t border-outline-variant/10 bg-white/70 backdrop-blur-xl relative z-10">
        <form onSubmit={onSendMessage} className="relative">
          <input 
            className="w-full bg-surface-container-high border-none rounded-[1.8rem] py-5 pl-10 pr-16 font-bold text-sm italic tracking-tight outline-none focus:bg-white focus:shadow-ref focus:ring-2 focus:ring-primary/10 transition-all placeholder:opacity-30" 
            placeholder="Transmit message..." 
            value={newMessage}
            onChange={onMessageChange}
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-white rounded-[1.2rem] flex items-center justify-center hover:bg-primary-dim hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CircleChat;
