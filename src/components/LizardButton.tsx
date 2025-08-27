import React, { useState, useRef, useCallback, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface LizardButtonProps {
  onCountChange?: (count: number) => void;
}

const LizardButton: React.FC<LizardButtonProps> = ({ onCountChange }) => {
  const [count, setCount] = useLocalStorage<number>('lizardClickCount', 0);
  const [sessionClicks, setSessionClicks] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio('/public/sounds/lizard.mp3');
    audioRef.current.preload = 'auto';
    
    const handleCanPlayThrough = () => setAudioReady(true);
    audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
      }
    };
  }, []);

  const showConfetti = () => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      life: number;
    }> = [];

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * -8 - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.3;
        particle.life -= 0.02;

        if (particle.life <= 0) {
          particles.splice(index, 1);
          return;
        }

        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, 4, 4);
      });

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        document.body.removeChild(canvas);
      }
    };

    animate();
  };

  const playTripleChant = useCallback(async () => {
    if (!audioRef.current || !audioReady) return;
    
    const playDelayed = (delay: number) => {
      setTimeout(() => {
        if (audioRef.current) {
          const audioClone = audioRef.current.cloneNode() as HTMLAudioElement;
          audioClone.play().catch(console.error);
        }
      }, delay);
    };

    playDelayed(0);
    playDelayed(120);
    playDelayed(240);
    
    showConfetti();
  }, [audioReady]);

  const handleClick = useCallback(async () => {
    const newCount = count + 1;
    const newSessionClicks = sessionClicks + 1;
    
    setCount(newCount);
    setSessionClicks(newSessionClicks);
    onCountChange?.(newCount);

    if (audioRef.current && audioReady) {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch (error) {
        console.warn('Audio play failed:', error);
      }
    }

    if (newSessionClicks === 3 || newSessionClicks === 6 || newSessionClicks === 9) {
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 2000);
    }

    if (newCount % 50 === 0) {
      playTripleChant();
    }
  }, [count, sessionClicks, audioReady, onCountChange, playTripleChant]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <div className="relative flex flex-col items-center">
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="
          bg-green-500 hover:bg-green-600 active:bg-green-700
          text-white font-bold text-6xl
          px-12 py-8 rounded-2xl
          transform hover:scale-105 active:scale-95
          transition-all duration-150
          shadow-lg hover:shadow-xl
          focus:outline-none focus:ring-4 focus:ring-green-300
          focus:ring-opacity-50
        "
        aria-label={`Lizard button - clicked ${count} times`}
        tabIndex={0}
      >
        🦎 LIZARD
      </button>
      
      {showBubble && (
        <div className="
          absolute -top-16 left-1/2 transform -translate-x-1/2
          bg-white border-2 border-gray-300 rounded-lg px-4 py-2
          shadow-lg z-10 animate-bounce
          after:content-[''] after:absolute after:top-full after:left-1/2 
          after:transform after:-translate-x-1/2 after:border-8 
          after:border-transparent after:border-t-white
        ">
          <span className="text-2xl font-bold text-green-600">Lizard!</span>
        </div>
      )}
    </div>
  );
};

export default LizardButton;