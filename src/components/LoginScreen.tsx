import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Shield } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
  playKey: () => void;
  playClick: () => void;
}

export const LoginScreen: React.FC<LoginProps> = ({ onSuccess, playKey, playClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    if (username === 'ADMIN_ENTRY' && password === 'THE_WALL') {
      onSuccess();
    } else {
      setError('INVALID CREDENTIALS. ACCESS DENIED.');
      setPassword('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="text-center flex flex-col items-center gap-4">
        <div className="relative">
          <Shield size={48} className="text-[#33ff33] animate-pulse" />
          <div className="absolute inset-0 bg-[#33ff33]/20 blur-xl rounded-full" />
        </div>
        <h1 className="text-2xl font-black tracking-widest border-b-2 border-[#33ff33] pb-2 text-[#33ff33]">GATE_OS v4.1</h1>
        <p className="text-[10px] opacity-50 uppercase tracking-[0.2em]">Securing the border since 1982</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-4 bg-[#001100] p-6 border border-[#33ff33] shadow-[0_0_20px_rgba(51,255,51,0.1)]">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] uppercase opacity-70 font-bold tracking-wider">User Identity</label>
          <input
            autoFocus
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value.toUpperCase()); playKey(); }}
            className="bg-black border border-[#33ff33] p-2 outline-none focus:bg-[#33ff33]/10 transition-colors uppercase text-[#33ff33] font-mono"
            placeholder="ID_742"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-end">
            <label className="text-[9px] uppercase opacity-70 font-bold tracking-wider">Access Sequence</label>
            <span className="text-[7px] opacity-40 uppercase italic">Hint: THE_WALL</span>
          </div>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); playKey(); }}
              className="bg-black border border-[#33ff33] p-2 outline-none focus:bg-[#33ff33]/10 transition-colors w-full text-[#33ff33] font-mono"
              placeholder="••••••••"
            />
            <Lock className="absolute right-3 top-2.5 opacity-30 text-[#33ff33]" size={16} />
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ x: -10 }} 
            animate={{ x: 0 }} 
            className="text-red-600 text-[9px] uppercase font-black text-center mt-2 border border-red-600/30 p-1 bg-red-600/10"
          >
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          className="bg-[#33ff33] text-black font-black py-2 mt-4 hover:bg-[#33ff33]/80 active:translate-y-0.5 transition-all uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(51,255,51,0.3)]"
        >
          Initialize Login
        </button>
      </form>

      <div className="mt-8 text-[8px] opacity-30 text-center uppercase max-w-xs leading-tight">
        Property of United Border Control. Unauthorized access is punishable by imprisonment or relocation to Section 8.
      </div>
    </div>
  );
};
