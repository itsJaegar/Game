import React from 'react';

export const CRTOverlay: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = '#33ff33' }) => {
  return (
    <div 
      className="relative min-h-screen bg-black font-mono overflow-hidden border-8 border-[#1a1a1a] shadow-inner flex flex-col"
      style={{ color }}
    >
      {/* CRT Scanline Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-50 pointer-events-none" 
        style={{ 
          background: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), ${color}10, rgba(0, 0, 255, 0.03))`, 
          backgroundSize: '100% 3px, 3px 100%' 
        }} 
      />
      
      {/* Screen Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-40 opacity-20" 
        style={{ background: `radial-gradient(circle, ${color}26 0%, rgba(0, 0, 0, 0) 80%)` }} 
      />

      {/* Flicker Effect */}
      <div className="pointer-events-none absolute inset-0 z-40 animate-[flicker_0.15s_infinite] opacity-[0.03] bg-white" />
      
      {/* Content Area */}
      <div className="relative z-10 flex-grow flex flex-col h-full">
         {children}
      </div>

      <style>{`
        @keyframes flicker {
          0% { opacity: 0.027; }
          100% { opacity: 0.04; }
        }
      `}</style>
    </div>
  );
};
