import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

const MediaPlayer = ({ mediaLink }) => {
  const [localMediaLink, setLocalMediaLink] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Control the modal
  const playerRef = useRef(null);

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalMediaLink(url);
      setIsModalOpen(true); // Open modal when a file is selected
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsPlaying(true); // Auto-start playback when modal opens
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsPlaying(false); // Pause when modal closes
  };

  const currentLink = localMediaLink || mediaLink;

  useEffect(() => {
    if (isModalOpen) {
      setIsPlaying(true); // Ensure autoplay when modal is open
    }
  }, [isModalOpen]);

  return (
    <div className="mt-4">
      <input
        type="file"
        accept="video/mp4, audio/*"
        onChange={handleFileInput}
        className="mb-4"
      />

      <button
        onClick={handleOpenModal}
        className="bg-green-500 text-white px-4 py-2 rounded-lg"
      >
        Open Media Player
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-xl">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
            >
              ✕
            </button>

            {currentLink ? (
              <ReactPlayer
                ref={playerRef}
                url={currentLink}
                playing={isPlaying}
                controls
                width="100%"
                height="auto"
              />
            ) : (
              <p className="text-gray-500">No media selected or invalid link.</p>
            )}

            {currentLink && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="mr-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>

                <button
                  onClick={handleCloseModal}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPlayer;
