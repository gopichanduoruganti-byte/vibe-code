import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Radio } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'ERR_FILE_NOT_FOUND', url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=cyberpunk-2099-10701.mp3' },
  { id: 2, title: 'DATA_CORRUPTION', url: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_d1718ab41f.mp3?filename=cyberpunk-city-126237.mp3' },
  { id: 3, title: 'MEMORY_LEAK', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=cyberpunk-street-111451.mp3' }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-[#ff00ff] p-6 shadow-[-8px_8px_0px_#00ffff] relative">
      <div className="absolute top-0 right-0 bg-[#ff00ff] text-black font-pixel text-[8px] px-2 py-1">
        AUDIO_STREAM_ACTIVE
      </div>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      <div className="flex items-center space-x-4 mb-6 mt-2">
        <div className="w-12 h-12 bg-black border-2 border-[#00ffff] flex items-center justify-center animate-pulse">
          <Radio className="w-6 h-6 text-[#ff00ff]" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-[#00ffff] font-pixel text-xs truncate glitch-text" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-[#ff00ff] text-[10px] font-pixel mt-2">SECTOR {currentTrackIndex + 1}/{TRACKS.length}</p>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-2 bg-gray-900 appearance-none cursor-pointer accent-[#00ffff] border border-[#ff00ff]"
        />
        <div className="flex justify-between mt-2 text-[10px] font-pixel text-[#00ffff]">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={() => setIsMuted(!isMuted)} className="text-[#ff00ff] hover:text-[#00ffff] transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 h-1 bg-gray-900 appearance-none cursor-pointer accent-[#ff00ff]"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={prevTrack}
            className="p-2 text-[#00ffff] hover:text-[#ff00ff] hover:bg-[#00ffff]/20 transition-all border border-transparent hover:border-[#00ffff]"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button 
            onClick={togglePlay}
            className="p-3 bg-[#ff00ff] text-black hover:bg-[#00ffff] transition-all border-2 border-[#00ffff] hover:border-[#ff00ff]"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>
          <button 
            onClick={nextTrack}
            className="p-2 text-[#00ffff] hover:text-[#ff00ff] hover:bg-[#00ffff]/20 transition-all border border-transparent hover:border-[#00ffff]"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
