import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface EmailProps {
  day: number;
  onComplete: () => void;
  playKey: () => void;
  playClick: () => void;
}

interface EmailData {
  id: number;
  from: string;
  subject: string;
  body: string;
  time: string;
  isRead: boolean;
}

import { getEmailsForDay } from '../constants';

export const EmailClient: React.FC<EmailProps> = ({ day, onComplete, playKey, playClick }) => {
  const [emails, setEmails] = useState<EmailData[]>(getEmailsForDay(day).map(e => ({ ...e, isRead: false })));
  const [selectedEmail, setSelectedEmail] = useState<EmailData>(emails[0]);

  const selectEmail = (email: EmailData) => {
    playClick();
    setSelectedEmail(email);
    setEmails(prev => prev.map(e => e.id === email.id ? { ...e, isRead: true } : e));
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Inbox List */}
      <div className="border border-current bg-[#001100] h-48 overflow-y-auto">
        <div className="grid grid-cols-6 text-[10px] opacity-70 border-b border-current p-2 bg-[#002200] sticky top-0">
          <div className="col-span-1">FROM</div>
          <div className="col-span-3">SUBJECT</div>
          <div className="col-span-2 text-right">TIME</div>
        </div>
        {emails.map(email => (
          <div 
            key={email.id}
            onClick={() => selectEmail(email)}
            className={`grid grid-cols-6 text-[10px] p-2 cursor-pointer border-b border-current/10 hover:bg-current/20 transition-colors ${selectedEmail.id === email.id ? 'bg-current/30' : ''} ${!email.isRead ? 'font-bold' : 'opacity-60'}`}
          >
            <div className="col-span-1 truncate pr-2">{email.from}</div>
            <div className="col-span-3 truncate">{email.subject}</div>
            <div className="col-span-2 text-right">{email.time}</div>
          </div>
        ))}
      </div>
      
      {/* Email Body Area */}
      <div className="flex-grow border border-current p-6 md:p-8 relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] bg-black/40 overflow-y-auto">
        <div className="max-w-2xl">
          <h1 className="text-lg font-bold mb-4 border-b border-current inline-block uppercase tracking-tight">
            MSG_{selectedEmail.id}: {selectedEmail.subject}
          </h1>
          
          <div className="whitespace-pre-wrap leading-relaxed mb-8 text-sm md:text-sm font-mono opacity-90">
            {selectedEmail.body}
          </div>

          <div className="flex justify-between items-end border-t border-current/20 pt-4 mt-8">
            <div className="opacity-50 text-[10px]">
              <p>ENCRYPTION: LEVEL_4</p>
              <p>SENDER: {selectedEmail.from}</p>
            </div>
            
            {selectedEmail.id === 1 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => {
                  playClick();
                  onComplete();
                }}
                className="bg-current text-black px-6 py-2 font-black uppercase text-xs hover:opacity-80 transition-all shadow-lg"
              >
                INITIALIZE TERMINAL
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
