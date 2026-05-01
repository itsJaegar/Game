import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

const AMBIENT_URL = 'https://assets.mixkit.co/active_storage/sfx/2566/2566-preview.mp3'; // Constant computer fan/hum
const CLICK_URL = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'; // Mechanical click
const KEY_URL = 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'; // Key press

export const useTerminalSounds = () => {
  const ambientRef = useRef<Howl | null>(null);
  const clickRef = useRef<Howl | null>(null);
  const keyRef = useRef<Howl | null>(null);

  useEffect(() => {
    ambientRef.current = new Howl({
      src: [AMBIENT_URL],
      loop: true,
      volume: 0.05, // Much subtle background hum
      rate: 0.8, // Slightly lower pitch to make it "slower" and less obnoxious
    });

    clickRef.current = new Howl({
      src: [CLICK_URL],
      volume: 0.3,
    });

    keyRef.current = new Howl({
      src: [KEY_URL],
      volume: 0.2,
    });

    return () => {
      ambientRef.current?.stop();
    };
  }, []);

  const startAmbient = () => {
    if (!ambientRef.current?.playing()) {
      ambientRef.current?.play();
    }
  };

  const playClick = () => clickRef.current?.play();
  const playKey = () => keyRef.current?.play();

  return { startAmbient, playClick, playKey };
};
