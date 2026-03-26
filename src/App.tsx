import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Cpu } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center relative font-glitch crt-flicker">
      {/* Anaconda Background */}
      <div 
        className="absolute inset-0 z-0 opacity-30 mix-blend-luminosity bg-cover bg-center"
        style={{ backgroundImage: `url('https://picsum.photos/seed/anaconda/1920/1080')` }}
      />
      <div className="absolute inset-0 z-0 bg-[#ff00ff]/10 mix-blend-color" />
      
      {/* Glitch Overlays */}
      <div className="scanlines" />
      <div className="static-noise" />

      <div className="z-10 w-full max-w-7xl px-4 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Terminal & Audio */}
        <div className="flex flex-col items-center lg:items-start space-y-8 w-full lg:w-1/3">
          <div className="text-center lg:text-left border-l-8 border-[#ff00ff] pl-4 bg-black/50 p-4">
            <h1 
              className="text-3xl md:text-4xl font-pixel text-[#00ffff] glitch-text mb-4 uppercase"
              data-text="SNAKE_PROTOCOL"
            >
              SNAKE_PROTOCOL
            </h1>
            <p className="text-[#ff00ff] font-pixel text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              SYS.VER. 9.9.9 // CORRUPTED
            </p>
          </div>
          
          <MusicPlayer />
          
          {/* Promoter Section -> Data Node */}
          <div className="w-full max-w-md bg-black border-4 border-[#00ffff] p-4 flex items-center space-x-4 relative overflow-hidden group shadow-[8px_8px_0px_#ff00ff]">
            <div className="absolute inset-0 bg-[#00ffff]/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/tollywood/150/150" 
                alt="Subject 001" 
                className="w-16 h-16 border-2 border-[#ff00ff] object-cover relative z-10 grayscale contrast-200"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#ff00ff]/40 mix-blend-overlay z-20 animate-pulse" />
            </div>
            <div className="z-10">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-[#00ffff]" />
                <p className="text-[#ff00ff] text-[10px] font-pixel uppercase">NODE_LINK_ESTABLISHED</p>
              </div>
              <p className="text-white font-pixel text-sm tracking-widest uppercase">
                T-WOOD_01
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Game */}
        <div className="w-full lg:w-2/3 flex justify-center">
          <SnakeGame onScoreUpdate={setScore} />
        </div>

      </div>
    </div>
  );
}
