import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Applicant } from '../types/game';
import { RULES_BY_DAY } from '../constants';
import { FileText, User, MapPin, AlertCircle, Check, X } from 'lucide-react';

interface TerminalProps {
  day: number;
  applicant: Applicant | null;
  onDecision: (approved: boolean) => void;
  playKey: () => void;
  playClick: () => void;
}

export const GameTerminal: React.FC<TerminalProps> = ({ day, applicant, onDecision, playKey, playClick }) => {
  const [log, setLog] = useState<string[]>([]);
  const rules = RULES_BY_DAY[day] || RULES_BY_DAY[1];

  useEffect(() => {
    if (applicant) {
      setLog(prev => [...prev, `[SYSTEM] NEW APPLICANT: ID#${applicant.id} DETECTED.`]);
    }
  }, [applicant]);

  if (!applicant) return <div className="animate-pulse">WAITING FOR NETWORK...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full flex-grow">
      {/* Left Pane: Documents */}
      <div className="border border-current p-4 bg-[#001100] flex flex-col gap-4 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 border-b border-current pb-2 bg-[#002200] -mx-4 -mt-4 px-4 py-2">
          <FileText size={16} />
          <span className="text-[10px] font-bold tracking-widest uppercase">IDENTIFICATION_V3.01</span>
        </div>
        
        <div className="flex gap-4 mt-2">
          <div className="w-24 h-24 border-2 border-current p-1 bg-black shadow-lg">
            <img 
              src={applicant.photo} 
              alt="Applicant" 
              className="w-full h-full object-cover grayscale brightness-110 contrast-150"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="flex flex-col gap-2 text-sm uppercase font-bold">
            <div className="flex justify-between gap-4 border-b border-current/20"><span className="opacity-50">NAME ID:</span> <span>{applicant.name}</span></div>
            <div className="flex justify-between gap-4 border-b border-current/20"><span className="opacity-50">SERIAL#:</span> <span>{applicant.id}</span></div>
            <div className="flex justify-between gap-4 border-b border-current/20"><span className="opacity-50">ORIGIN:</span> <span>{applicant.country}</span></div>
            <div className="flex justify-between gap-4 border-b border-current/20"><span className="opacity-50">VALIDITY:</span> <span className={new Date(applicant.documentExpiry) < new Date() ? "text-red-500 underline" : ""}>{applicant.documentExpiry}</span></div>
          </div>
        </div>

        <div className="bg-[#002200] border border-current/30 p-2 text-[9px] opacity-80 mt-auto">
          <div className="font-bold border-b border-current/30 mb-1 tracking-widest uppercase">INTEL_SURVEILLANCE_REPORT</div>
          <div className="grid grid-cols-2 gap-x-2">
            <span className="opacity-50">PURPOSE:</span> <span className={applicant.purpose === 'Diplomatic' ? "text-blue-400 font-bold" : ""}>{applicant.purpose}</span>
            <span className="opacity-50">THREAT_SCAN:</span> <span className={applicant.hasCriminalRecord ? "text-red-500 underline animate-pulse" : ""}>{applicant.hasCriminalRecord ? "CRIMINAL_DETECTED" : "CLEAR"}</span>
            <span className="opacity-50">VALUE_INDEX:</span> 
            <span className={day >= 3 && applicant.valueScore < (day >= 4 ? 55 : 40) ? "text-red-400" : ""}>
              {applicant.valueScore}% {day >= 3 && applicant.valueScore < (day >= 4 ? 55 : 40) ? "[FAIL]" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Right Pane: Decision & Rules */}
      <div className="flex flex-col gap-4">
        <div className="border border-current p-4 h-1/2 flex flex-col bg-[#001100]">
           <div className="flex items-center gap-2 border-b border-current pb-2 mb-2 bg-[#002200] -mx-4 -mt-4 px-4 py-2 text-[10px] font-bold tracking-widest">
              <AlertCircle size={14} />
              B.C.S_MANUAL_DAY_{day}
           </div>
           <ul className="text-[10px] list-none flex flex-col gap-2">
              {rules.map((rule, i) => (
                <li key={i} className="flex gap-2">
                  <span className="opacity-50">[{i+1}]</span>
                  <span className="opacity-90 leading-tight uppercase">{rule}</span>
                </li>
              ))}
           </ul>
        </div>

        <div className="border border-current p-4 flex-grow flex flex-col bg-[#001100]">
          <div className="text-[9px] font-mono mb-4 opacity-40 h-24 overflow-y-auto scrollbar-hide border border-current/10 p-2 bg-black/40">
            {log.slice(-6).map((line, i) => (
              <div key={i} className="mb-0.5 text-current opacity-80">{line}</div>
            ))}
          </div>

          <div className="flex gap-4 mt-auto">
            <button
              onClick={() => { playClick(); onDecision(true); }}
              className="flex-1 bg-black border-2 border-current p-3 flex flex-col items-center gap-1 hover:bg-current hover:text-black transition-all group shadow-lg"
            >
              <Check size={20} />
              <span className="text-[10px] font-black uppercase tracking-tighter">Approve Access</span>
            </button>
            <button
              onClick={() => { playClick(); onDecision(false); }}
              className="flex-1 bg-black border-2 border-red-600 text-red-600 p-3 flex flex-col items-center gap-1 hover:bg-red-600 hover:text-black transition-all group shadow-lg"
            >
              <X size={20} />
              <span className="text-[10px] font-black uppercase tracking-tighter">Deny Entry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
