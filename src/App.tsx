/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CRTOverlay } from './components/CRTOverlay';
import { EmailClient } from './components/EmailClient';
import { LoginScreen } from './components/LoginScreen';
import { GameTerminal } from './components/GameTerminal';
import { Pet } from './components/Pet';
import { useTerminalSounds } from './hooks/useTerminalSounds';
import { GameStage, GameState, Applicant } from './types/game';
import { generateApplicant, SHOP_ITEMS, COLORS, FONTS } from './constants';
import { RefreshCw, Terminal as TerminalIcon } from 'lucide-react';

export default function App() {
  const { startAmbient, playClick, playKey } = useTerminalSounds();
  const [gameState, setGameState] = useState<GameState>({
    day: 1,
    stage: 'BOOT',
    score: 0,
    totalPoints: 0,
    applicantsProcessed: 0,
    currentApplicantIndex: 0,
    applicants: [],
    approvedHistory: [],
    ownedPets: [],
    settings: {
      color: '#33ff33',
      font: '"JetBrains Mono", monospace'
    }
  });

  const [currentApplicant, setCurrentApplicant] = useState<Applicant | null>(null);

  // Initialize day
  const startDay = useCallback((day: number) => {
    const dailyApplicants = Array.from({ length: 5 }, () => generateApplicant(day));
    
    // Update history based on day - chance for someone to become DECEASED
    setGameState(prev => ({
      ...prev,
      day,
      applicants: dailyApplicants,
      currentApplicantIndex: 0,
      applicantsProcessed: 0,
      approvedHistory: prev.approvedHistory.map(app => {
        if (app.status === 'ALIVE' && Math.random() < (day * 0.1)) {
          return { ...app, status: 'DECEASED', deathDay: day };
        }
        return app;
      })
    }));
    setCurrentApplicant(dailyApplicants[0]);
  }, []);

  useEffect(() => {
    if (gameState.stage === 'TERMINAL' && gameState.applicants.length === 0) {
      startDay(gameState.day);
    }
  }, [gameState.stage, gameState.day, gameState.applicants.length, startDay]);

  const handleDecision = (approved: boolean) => {
    if (!currentApplicant) return;

    const isExpired = new Date(currentApplicant.documentExpiry) < new Date();
    const hasRecord = currentApplicant.hasCriminalRecord;
    const isKolechia = currentApplicant.country === 'Kolechia';
    const isAntegria = currentApplicant.country === 'Antegria';
    const isCobrastan = currentApplicant.country === 'Cobrastan';
    const isDiplomatic = currentApplicant.purpose === 'Diplomatic';

    const evaluate = () => {
      if (isExpired) return false;
      if (hasRecord) return false;
      if (gameState.day >= 2 && isKolechia) return false;
      if (gameState.day >= 3) {
        const threshold = gameState.day >= 4 ? 55 : 40;
        if (!isDiplomatic && currentApplicant.valueScore < threshold) return false;
      }
      if (gameState.day >= 4 && isAntegria) return false;
      if (gameState.day >= 5 && isCobrastan) return false;
      return true;
    };

    const shouldApprove = evaluate();
    const isCorrect = approved === shouldApprove;

    const baseReward = 100;
    const penalty = gameState.day * 25;
    
    const scoreDiff = isCorrect ? baseReward : -penalty;

    setGameState(prev => {
      const newScore = prev.score + scoreDiff;
      const historyUpdate = approved ? [...prev.approvedHistory, { ...currentApplicant, status: 'ALIVE' as const }] : prev.approvedHistory;
      return {
        ...prev,
        score: newScore,
        totalPoints: prev.totalPoints + Math.max(0, scoreDiff),
        applicantsProcessed: prev.applicantsProcessed + 1,
        currentApplicantIndex: prev.currentApplicantIndex + 1,
        approvedHistory: historyUpdate
      };
    });

    if (gameState.currentApplicantIndex + 1 < gameState.applicants.length) {
      setCurrentApplicant(gameState.applicants[gameState.currentApplicantIndex + 1]);
    } else {
      setGameState(prev => ({ ...prev, stage: 'SUMMARY' }));
    }
  };

  const renderStage = () => {
    switch (gameState.stage) {
      case 'BOOT':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4 cursor-pointer" onClick={() => { startAmbient(); setGameState(prev => ({ ...prev, stage: 'EMAIL' })); }}>
            <TerminalIcon size={64} className="animate-pulse mb-4" />
            <div className="text-xl font-bold animate-bounce text-current">[ CLICK TO INITIALIZE ]</div>
            <p className="text-xs opacity-50 mt-10">GATESYS v4.1 (C) 1982-2026</p>
          </div>
        );
      case 'EMAIL':
        return <EmailClient day={gameState.day} onComplete={() => setGameState(prev => ({ ...prev, stage: 'LOGIN' }))} playKey={playKey} playClick={playClick} />;
      case 'LOGIN':
        return <LoginScreen onSuccess={() => setGameState(prev => ({ ...prev, stage: 'TERMINAL' }))} playKey={playKey} playClick={playClick} />;
      case 'TERMINAL':
        return <GameTerminal day={gameState.day} applicant={currentApplicant} onDecision={handleDecision} playKey={playKey} playClick={playClick} />;
      case 'DATABASE':
        return (
          <div className="flex flex-col h-full">
            <h2 className="text-xl font-black border-b border-current mb-4 uppercase tracking-widest">CITIZEN_REGISTRY_DATABASE</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2">
              {gameState.approvedHistory.length === 0 && <div className="col-span-full text-center opacity-30 mt-10 uppercase">No entries found.</div>}
              {gameState.approvedHistory.slice().reverse().map((app, i) => (
                <div key={i} className={`border p-2 bg-black/40 relative ${app.status === 'DECEASED' ? 'border-red-900 border-dashed grayscale opacity-60' : 'border-current'}`}>
                  <div className="flex gap-2">
                    <img src={app.photo} className="w-12 h-12 border border-current" style={{ imageRendering: 'pixelated' }} />
                    <div className="text-[10px] uppercase truncate">
                      <div className="font-bold">{app.name}</div>
                      <div>ID: {app.id}</div>
                      <div className={app.status === 'DECEASED' ? 'text-red-500 font-black' : 'text-[#33ff33]'}>STATUS: {app.status}</div>
                      {app.deathDay && <div className="text-red-400">LOST ON DAY {app.deathDay}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'SHOP':
        return (
          <div className="flex flex-col h-full gap-4">
            <div className="flex justify-between items-center border-b border-current pb-2">
              <h2 className="text-xl font-black uppercase tracking-widest">COMPANION_SHOP.v1</h2>
              <div className="text-sm bg-current text-black px-2 font-black">CREDITS: {gameState.totalPoints} CR</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SHOP_ITEMS.map(item => {
                const isOwned = gameState.ownedPets.some(p => p.id === item.id);
                return (
                  <div key={item.id} className="border border-current p-4 bg-[#001100] flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{item.name}</span>
                      <span className="text-xs opacity-60">{item.price} CR</span>
                    </div>
                    <button
                      disabled={isOwned || gameState.totalPoints < item.price}
                      onClick={() => {
                        playClick();
                        setGameState(prev => ({
                          ...prev,
                          totalPoints: prev.totalPoints - item.price,
                          ownedPets: [...prev.ownedPets, { id: item.id, type: item.type as any, name: item.name }]
                        }));
                      }}
                      className="border border-current px-2 py-1 text-xs hover:bg-current hover:text-black transition-colors disabled:opacity-30 uppercase font-black"
                    >
                      {isOwned ? '[ DEPLOYED ]' : '[ PURCHASE ]'}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-auto text-[10px] opacity-40 italic">"GATESYS: Because solitude is the greatest security risk."</div>
          </div>
        );
      case 'CONFIG':
        return (
          <div className="flex flex-col h-full gap-8">
            <h2 className="text-xl font-black border-b border-current mb-4 uppercase tracking-widest">SYSTEM_CONFIGURATION_UTILITY</h2>
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase block border-l-2 border-current pl-2">Terminal Chromaticity</label>
                <div className="flex gap-4">
                  {COLORS.map(c => (
                    <button 
                      key={c.name}
                      onClick={() => { playClick(); setGameState(prev => ({ ...prev, settings: { ...prev.settings, color: c.value } })); }}
                      className={`w-8 h-8 border-2 ${gameState.settings.color === c.value ? 'border-white scale-110 shadow-lg' : 'border-current opacity-60'}`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase block border-l-2 border-current pl-2">Display Font-Matrix</label>
                <div className="flex flex-col gap-2">
                  {FONTS.map(f => (
                    <button 
                      key={f.name}
                      onClick={() => { playClick(); setGameState(prev => ({ ...prev, settings: { ...prev.settings, font: f.value } })); }}
                      className={`text-left px-4 py-2 border ${gameState.settings.font === f.value ? 'bg-current text-black' : 'border-current opacity-60 hover:opacity-100'}`}
                      style={{ fontFamily: f.value }}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'SUMMARY':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
             <h2 className="text-3xl font-black border-b border-current pb-2">DAY {gameState.day} CONCLUDED</h2>
             <div className="grid grid-cols-2 gap-8 text-left w-full max-w-sm">
                <span className="opacity-70 uppercase tracking-widest">Efficiency:</span>
                <span className="font-bold text-xl">{gameState.score} CR</span>
                <span className="opacity-70 uppercase tracking-widest">Processed:</span>
                <span className="font-bold text-xl">{gameState.applicantsProcessed} ENTITIES</span>
             </div>
             
             <div className="mt-8 flex flex-col gap-4 w-full max-w-xs">
               <button 
                 onClick={() => {
                   playClick();
                   const nextDay = gameState.day + 1;
                   setGameState(prev => ({ ...prev, day: nextDay, stage: 'TERMINAL', score: 0 }));
                   startDay(nextDay);
                 }}
                 className="border-2 border-current py-3 font-black hover:bg-current hover:text-black transition-all flex items-center justify-center gap-2"
               >
                 NEXT WORK SHIFT [ DAY {gameState.day + 1} ]
               </button>
               <div className="flex gap-2">
                 <button 
                  onClick={() => setGameState(prev => ({ ...prev, stage: 'SHOP' }))}
                  className="flex-1 border border-current py-2 text-xs font-bold hover:bg-current hover:text-black uppercase"
                 >
                   Open Shop
                 </button>
                 <button 
                  onClick={() => setGameState(prev => ({ ...prev, stage: 'DATABASE' }))}
                  className="flex-1 border border-current py-2 text-xs font-bold hover:bg-current hover:text-black uppercase"
                 >
                   Reg. DB
                 </button>
               </div>
               <button 
                 onClick={() => { playClick(); window.location.reload(); }}
                 className="text-[10px] opacity-40 hover:opacity-100 flex items-center justify-center gap-1"
               >
                 <RefreshCw size={10} /> REBOOT SYSTEM
               </button>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: gameState.settings.font }}>
      <CRTOverlay color={gameState.settings.color}>
        {/* Top Navigation / Status Bar */}
        <header className="flex justify-between items-center bg-[#002200] border-b border-current px-4 py-2 text-[10px] md:text-xs z-20">
          <div className="flex items-center space-x-4 md:space-x-6">
            <span className="font-bold tracking-widest hidden sm:inline">GATESYS_OPERATING_SYSTEM_v4.1</span>
            <span className="opacity-70">LINK: STABLE [982.11.{gameState.day}]</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <span className="hidden sm:inline">WALLET: {gameState.totalPoints} CR</span>
            <span>DAY {gameState.day}</span>
            <span className="animate-pulse">● ONLINE</span>
          </div>
        </header>

        <div className="flex flex-grow overflow-hidden z-20">
          {/* Sidebar: Folders/App List */}
          <nav className="w-48 hidden md:flex flex-col border-r border-current p-4 space-y-4 bg-black">
            <div className="space-y-1">
              <div className="text-[10px] opacity-50 mb-2 mt-2">DIRECTORIES</div>
              <div 
                className={`px-2 py-1 flex items-center cursor-pointer transition-colors ${gameState.stage === 'EMAIL' ? 'bg-current text-black' : 'hover:bg-opacity-20 hover:bg-current opacity-80'}`}
                onClick={() => gameState.stage !== 'BOOT' && setGameState(prev => ({ ...prev, stage: 'EMAIL' }))}
              >
                <span className="mr-2">▶</span> INBOX
              </div>
              <div 
                className={`px-2 py-1 flex items-center cursor-pointer transition-colors ${gameState.stage === 'TERMINAL' ? 'bg-current text-black' : 'hover:bg-opacity-20 hover:bg-current opacity-80'}`}
                onClick={() => gameState.stage !== 'BOOT' && setGameState(prev => ({ ...prev, stage: 'TERMINAL' }))}
              >
                ADMISSIONS
              </div>
              <div 
                className={`px-2 py-1 flex items-center cursor-pointer transition-colors ${gameState.stage === 'DATABASE' ? 'bg-current text-black' : 'hover:bg-opacity-20 hover:bg-current opacity-80'}`}
                onClick={() => gameState.stage !== 'BOOT' && setGameState(prev => ({ ...prev, stage: 'DATABASE' }))}
              >
                CITIZEN_DB
              </div>
            </div>
            
            <div className="mt-auto space-y-1 pb-4">
              <div className="text-[10px] opacity-50 mb-2">SHOP</div>
              <div 
                className={`px-2 py-1 flex items-center cursor-pointer transition-colors ${gameState.stage === 'SHOP' ? 'bg-current text-black' : 'hover:bg-opacity-20 hover:bg-current opacity-80'}`}
                onClick={() => gameState.stage !== 'BOOT' && setGameState(prev => ({ ...prev, stage: 'SHOP' }))}
              >
                COMPANIONS
              </div>
              <div className="text-[10px] opacity-50 mb-2 mt-4">SYSTEM</div>
              <div 
                className={`px-2 py-1 flex items-center cursor-pointer transition-colors ${gameState.stage === 'CONFIG' ? 'bg-current text-black' : 'hover:bg-opacity-20 hover:bg-current opacity-80'}`}
                onClick={() => gameState.stage !== 'BOOT' && setGameState(prev => ({ ...prev, stage: 'CONFIG' }))}
              >
                CONFIG
              </div>
              <div 
                className="px-2 py-1 hover:bg-red-900 border border-transparent hover:border-red-500 hover:text-white cursor-pointer transition-colors"
                onClick={() => window.location.reload()}
              >
                LOG_OFF
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-grow p-4 md:p-6 overflow-y-auto flex flex-col relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={gameState.stage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-grow flex flex-col"
              >
                {renderStage()}
              </motion.div>
            </AnimatePresence>

            {/* Pets */}
            {gameState.ownedPets.map(pet => (
              <Pet key={pet.id} type={pet.type} />
            ))}

            {/* Corner Detail Decoration */}
            <div className="absolute top-4 right-4 w-16 h-16 opacity-5 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current stroke-1">
                <circle cx="50" cy="50" r="45" />
                <path d="M50 5 L50 95 M5 50 L95 50" strokeDasharray="2 2" />
              </svg>
            </div>
          </main>
        </div>

        {/* Bottom Command / Footer */}
        <footer className="h-10 border-t border-current bg-black flex items-center px-4 space-x-4 z-20">
          <div className="font-bold text-xs">PROMPT &gt;</div>
          <div className="flex-1 flex items-center text-xs">
            <span className="mr-2 uppercase">
              {gameState.stage === 'BOOT' ? 'system --init' : 
               gameState.stage === 'LOGIN' ? 'ssh admin@gatesys' :
               gameState.stage === 'EMAIL' ? 'mail --read' :
               gameState.stage === 'TERMINAL' ? `process --entity-${currentApplicant?.id || 'null'}` :
               gameState.stage === 'SHOP' ? 'buy --companion' :
               gameState.stage === 'DATABASE' ? 'query --registry' :
               gameState.stage === 'CONFIG' ? 'sys --configure' :
               'session --summary'}
            </span>
            <span className="w-2 h-4 bg-current animate-pulse"></span>
          </div>
          <div className="hidden sm:block text-[10px] opacity-50 uppercase">
            MEM_USAGE: {(Math.random() * 5 + 40).toFixed(1)}% | CPU_LOAD: {(Math.random() * 8 + 10).toFixed(0)}%
          </div>
        </footer>
      </CRTOverlay>
    </div>
  );
}

