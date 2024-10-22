import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import localforage from 'localforage';

const MediaPlayer = ({ qid }) => {
  console.log('qid', qid);
  const [mediaFiles, setMediaFiles] = useState([]); 
  const [localMediaLink, setLocalMediaLink] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileInputVisible, setIsFileInputVisible] = useState(true);
  const playerRef = useRef(null);

  // 🔄 Load media files from LocalForage on component mount
  useEffect(() => {
    const loadFiles = async () => {
      const storedFiles = await localforage.getItem('mediaFiles');
      if (storedFiles) {
        const filesWithBlobURLs = storedFiles.map((file) => ({
          ...file,
          url: URL.createObjectURL(file.blob), // Regenerate Blob URLs
        }));
        setMediaFiles(filesWithBlobURLs);
        setIsFileInputVisible(false);
      }
    };
    loadFiles();
  }, []);

  // 📂 Handle file input and save files to LocalForage
  const handleFileInput = async (event) => {
    const files = Array.from(event.target.files);
    const mediaArray = files.map((file) => ({
      name: file.name,
      type: file.type,
      blob: file, // Store the File object for persistence
    }));

    setMediaFiles(mediaArray.map((file) => ({
      ...file,
      url: URL.createObjectURL(file.blob), // Generate blob URLs
    })));

    await localforage.setItem('mediaFiles', mediaArray);
    setIsFileInputVisible(false);
  };

  // ▶️ Play selected media
  const playMedia = (url) => {
    setLocalMediaLink(url);
    setIsModalOpen(true);
    setIsPlaying(true);
  };

  // ❌ Close the modal and stop playing
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsPlaying(false);
    setLocalMediaLink(null);
  };

  return (
    <div className="mt-4">
      {/* File Input (only visible initially) */}
      {isFileInputVisible && (
        <input
          type="file"
          accept="video/mp4, audio/*"
          multiple
          onChange={handleFileInput}
          className="mb-4"
        />
      )}

      {/* Buttons for available media files */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {mediaFiles.map((file, index) => (
          <button
            key={index}
            onClick={() => playMedia(file.url)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            {file.name}
          </button>
        ))}
      </div>

      {/* Modal with Media Player */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-xl">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
            >
              ✕
            </button>

            {localMediaLink ? (
              <ReactPlayer
                ref={playerRef}
                url={localMediaLink}
                playing={isPlaying}
                controls
                width="100%"
                height="auto"
              />
            ) : (
              <p className="text-gray-500">No media selected or invalid link.</p>
            )}

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
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPlayer;
