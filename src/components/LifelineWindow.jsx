import React, { useRef } from "react";
import audioFile from "../components/sounds/s.mp3"; // Import the audio file

const LifelineWindow = ({ lifelines, onLifelineClick }) => {
  // Initialize the audio element with the imported file
  const audioRef = useRef(new Audio(audioFile));

  const handleLifelineClick = (lifeline) => {
    if (lifeline === 'fiftyFifty' && !lifelines.fiftyFifty) {
      audioRef.current.currentTime = 0; // Reset playback to the start
      audioRef.current.play(); // Play audio on "50-50" click
    }
    onLifelineClick(lifeline); // Call parent function
  };

  return (
    <div className="absolute top-10 left-[40%] bg-gray-800 text-white p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Lifelines</h3>

      <button
        className={`bg-blue-500 text-white p-4 mb-2 rounded-lg ${
          lifelines.fiftyFifty ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => handleLifelineClick("fiftyFifty")}
        disabled={lifelines.fiftyFifty}
      >
        50-50
      </button>

      <button
        className={`bg-green-500 text-white p-4 mb-2 rounded-lg ${
          lifelines.phoneAFriend ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => onLifelineClick("phoneAFriend")}
        disabled={lifelines.phoneAFriend}
      >
        Phone a Friend
      </button>

      <button
        className={`bg-yellow-500 text-white p-4 rounded-lg ${
          lifelines.askTheAudience ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => onLifelineClick("askTheAudience")}
        disabled={lifelines.askTheAudience}
      >
        Ask the Audience
      </button>
    </div>
  );
};

export default LifelineWindow;
