import React from 'react';
import { motion } from 'motion/react';
import { Dog, Cat, Bird, Bot, Target } from 'lucide-react';

interface PetProps {
  type: 'dog' | 'cat' | 'panda' | 'bird' | 'robot';
}

export const Pet: React.FC<PetProps> = ({ type }) => {
  const icons = {
    dog: <Dog size={24} />,
    cat: <Cat size={24} />,
    panda: <Target size={24} />, // Alternative for panda
    bird: <Bird size={24} />,
    robot: <Bot size={24} />,
  };

  return (
    <motion.div
      className="fixed bottom-12 z-30 pointer-events-none text-[#33ff33]"
      animate={{
        x: [0, 800, 0],
        y: [0, -10, 0, -20, 0],
      }}
      transition={{
        x: { duration: 30, repeat: Infinity, ease: 'linear' },
        y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{ left: '10%' }}
    >
      <div className="flex flex-col items-center">
        <div className="bg-black/80 p-1 border border-current rounded text-[8px] mb-1 opacity-60">
          HEALTH: 100%
        </div>
        {icons[type]}
      </div>
    </motion.div>
  );
};
