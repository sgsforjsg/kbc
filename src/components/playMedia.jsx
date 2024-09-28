import React, { useRef, useState, useEffect } from 'react';
import localMediaFile from './media/Sandeep_Maheshwari.mp4'; // Import the media file

const MediaPlayer = ({ mediaFile, onClose }) => {
  const mediaRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Use useEffect to play media automatically when the component mounts
  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.play();
      setIsPlaying(true);
    }

    // Cleanup function to pause the media when the component unmounts
    return () => {
      if (mediaRef.current) {
        mediaRef.current.pause();
        mediaRef.current.currentTime = 0; // Reset to the beginning
      }
    };
  }, [mediaFile]); // Run effect when mediaFile changes

  const pauseMedia = () => {
    mediaRef.current.pause();
    setIsPlaying(false);
  };

  const stopMedia = () => {
    mediaRef.current.pause();
    mediaRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
          >
            Close
          </button>
        </div>

        {/* Audio/Video element */}
        <div className="media-container my-4">
          <video ref={mediaRef} src={mediaFile} className="w-full rounded" controls />
        </div>
      </div>
    </div>
  );
};

const GameConsole = () => {
  const [showMediaPlayer, setShowMediaPlayer] = useState(true); // Set to true to show on mount

  return (
    <div>
      {/* Show media player with local media file */}
      {showMediaPlayer && (
        <MediaPlayer mediaFile={localMediaFile} onClose={() => setShowMediaPlayer(false)} />
      )}
    </div>
  );
};

export default GameConsole;
