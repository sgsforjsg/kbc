// components/MediaPlayer.js
import { useEffect, useRef, useState } from 'react';

const MediaPlayer = ({ mediaLink }) => {
  const mediaRef = useRef(null); // Ref to control media element
  const [isPlaying, setIsPlaying] = useState(false); // Track play/pause state

  const handlePlayPause = () => {
    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Play media automatically on component mount if link is available
  useEffect(() => {
    if (mediaLink) {
      mediaRef.current.play();
      setIsPlaying(true);
    }
  }, [mediaLink]);

  const isVideo = mediaLink.endsWith('.mp4') || mediaLink.includes('video');

  return (
    <div className="mt-4">
      {isVideo ? (
        <video ref={mediaRef} src={mediaLink} className="w-full rounded-md" controls />
      ) : (
        <audio ref={mediaRef} src={mediaLink} className="w-full" controls />
      )}
      <button 
        onClick={handlePlayPause} 
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default MediaPlayer;
