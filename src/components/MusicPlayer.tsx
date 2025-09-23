import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  duration: string;
  price: string;
  plays: number;
}

interface MusicPlayerProps {
  tracks: Track[];
  currentTrack: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
}) => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = tracks[currentTrack];

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setProgress(prev => (prev < 100 ? prev + 0.5 : 0));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-md border-t border-gray-700 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">{track.title.charAt(0)}</span>
            </div>
            <div>
              <h4 className="text-white font-medium">{track.title}</h4>
              <p className="text-gray-400 text-sm">{track.duration}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={onPrevious}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={togglePlayPause}
              className="w-12 h-12 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </button>
            
            <button
              onClick={onNext}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Progress and Volume */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            {/* Progress Bar */}
            <div className="flex-1 max-w-xs">
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-1 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 h-1 bg-gray-700 rounded-full outline-none slider"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;