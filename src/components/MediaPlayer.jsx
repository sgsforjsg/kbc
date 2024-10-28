import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player'; // React का Media Player Component
import localforage from 'localforage';  // Data को Local Storage में Store करने के लिए

const MediaPlayer = ({ qid }) => {
  console.log('qid', qid); // Debugging के लिए qid की value check करें
  const [mediaFiles, setMediaFiles] = useState([]); // Media Files को स्टोर करने के लिए State
  const [localMediaLink, setLocalMediaLink] = useState(null); // चुनी गई Media File का URL स्टोर करें
  const [isPlaying, setIsPlaying] = useState(false); // Media के Play/Pause को Track करने के लिए
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal का Open/Close Status
  const [isFileInputVisible, setIsFileInputVisible] = useState(true); // Input Box केवल एक बार दिखाने के लिए
  const playerRef = useRef(null); // Player को रेफरेंस करने के लिए

  // 🔄 Component Load होते ही LocalForage से Files को Load करें
  useEffect(() => {
    const loadFiles = async () => {
      const storedFiles = await localforage.getItem('mediaFiles'); // LocalForage से Files लोड करें
      if (storedFiles) {
        setMediaFiles(storedFiles); // Files को State में Set करें
        setIsFileInputVisible(false); // Files लोड होने पर Input Box छुपा दें
      }
    };
    loadFiles(); // Function को कॉल करें
  }, []);

  // 📂 File Input Handle करने के लिए Function
  const handleFileInput = async (event) => {
    const files = Array.from(event.target.files); // सभी चुनी हुई Files को Array में बदलें
    const mediaArray = files.map((file) => ({
      name: file.name, // File का नाम
      url: URL.createObjectURL(file), // File का Temporary URL बनाएँ
    }));
    setMediaFiles(mediaArray); // Files को State में Set करें
    await localforage.setItem('mediaFiles', mediaArray); // Files को LocalForage में Save करें
    setIsFileInputVisible(false); // Input Box को छुपा दें
  };

  // ▶️ Media Play करने के लिए Function
  const playMedia = (url) => {
    setLocalMediaLink(url); // चुनी गई File का URL Set करें
    setIsModalOpen(true); // Modal Open करें
    setIsPlaying(true); // Media को Play करें
  };

  // ❌ Modal बंद करने के लिए Function
  const handleCloseModal = () => {
    setIsModalOpen(false); // Modal बंद करें
    setIsPlaying(false); // Media को Pause करें
    setLocalMediaLink(null); // Local URL Reset करें
  };

  return (
    <div className="mt-4">
      {/* 📥 File Input (केवल पहली बार दिखेगा) */}
      {/* (
        <input
          type="file"
          accept="video/mp4, audio/*" // केवल Videos और Audio Files ही Allow करें
          multiple
          onChange={handleFileInput} // File Change होने पर Handle करें
          className="mb-4"
        />
      )*/}

      {/* 🟢 चुनी गई Files के लिए Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-4">
      {mediaFiles
  .filter((file) => new RegExp(`\\b${qid}\\b`).test(file.name)) // Match exact qid
  .map((file, index) => (
    <button
      key={index}
      onClick={() => playMedia(file.url)} // Play the filtered media
      className="bg-green-500 text-white px-4 py-2 rounded-lg"
    >
      {file.name} {/* Display the file name */}
    </button>
  ))}

      </div>

      {/* 📺 Modal (Media Player) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-xl">
            {/* ✖️ Close Button */}
            <button
              onClick={handleCloseModal} // Modal बंद करने के लिए
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
            >
              ✕
            </button>

            {/* 📹 ReactPlayer से Media Play करें */}
            {localMediaLink ? (
              <ReactPlayer
                ref={playerRef} // Player का Ref Set करें
                url={localMediaLink} // URL से Media Play करें
                playing={isPlaying} // Play/Pause Status
                controls // Player Controls दिखाएँ
                width="100%" // Width को Adjust करें
                height="auto" // Height Auto रखें
              />
            ) : (
              <p className="text-gray-500">No media selected or invalid link.</p> // यदि कोई File नहीं है
            )}

            {/* Play/Pause और Close Buttons */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)} // Play/Pause Toggle करें
                className="mr-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                {isPlaying ? 'Pause' : 'Play'} {/* Play/Pause Label */}
              </button>

              <button
                onClick={handleCloseModal} // Modal बंद करें
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
