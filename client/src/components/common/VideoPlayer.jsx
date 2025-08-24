import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import Button from './Button';

const VideoPlayer = ({ 
  src, 
  poster, 
  className = '', 
  controls = true,
  autoPlay = false,
  loop = false 
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !isMuted;
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    if (newVolume === 0) {
      video.muted = true;
    } else if (isMuted) {
      video.muted = false;
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const skip = (seconds) => {
    const video = videoRef.current;
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`relative group bg-black rounded-lg overflow-hidden ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(!isPlaying)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        autoPlay={autoPlay}
        loop={loop}
      />
      
      {controls && (
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div
            className="w-full h-2 bg-gray-600 rounded cursor-pointer mb-4 relative"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-primary-500 rounded relative"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                icon={isPlaying ? <Pause size={20} /> : <Play size={20} />}
                className="text-white hover:bg-white/20"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(-10)}
                icon={<SkipBack size={16} />}
                className="text-white hover:bg-white/20"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(10)}
                icon={<SkipForward size={16} />}
                className="text-white hover:bg-white/20"
              />
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  icon={isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  className="text-white hover:bg-white/20"
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const video = videoRef.current;
                  video.currentTime = 0;
                }}
                icon={<RotateCcw size={16} />}
                className="text-white hover:bg-white/20"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                icon={<Maximize size={16} />}
                className="text-white hover:bg-white/20"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
