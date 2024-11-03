import React, { useState } from "react";
import { Howl } from "howler"; // Import Howl from Howler
import audioFile from "../components/sounds/s.mp3"; // Import the audio file

const LifelineWindow = ({ lifelines, onLifelineClick }) => {
  const [isVisible, setIsVisible] = useState(true); // State to control visibility

  // Create a Howl instance for the audio file
  const sound = new Howl({
    src: [audioFile], // Specify the source of the audio file
    volume: 1.0, // Set the volume (0.0 to 1.0)
  });

  const handleLifelineClick = (lifeline) => {
    if (!lifelines[lifeline]) { // Check if lifeline is available
      sound.stop(); // Stop any currently playing sound
      sound.play(); // Play audio on lifeline click
    }
    
    onLifelineClick(lifeline); // Call parent function
    setIsVisible(false); // Hide the lifeline window after a click
  };

  if (!isVisible) return null; // If not visible, don't render anything

  return (
    <div className="fixed top-1/4 left-1/4 w-[40%] mx-auto bg-gray-600 text-white p-6 rounded-lg border-4 border-gray-400 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-center">Lifelines</h3>
      {/* Flex container for buttons */}
      <div className="flex justify-center space-x-2">
        <button
          className={`bg-blue-500 text-white p-4 rounded-lg flex-1 min-w-[120px] ${
            lifelines.fiftyFifty ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => handleLifelineClick("fiftyFifty")}
          disabled={lifelines.fiftyFifty}
        >
          50-50
        </button>

        <button
          className={`bg-green-500 text-white p-4 rounded-lg flex-1 min-w-[120px] ${
            lifelines.X2 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => handleLifelineClick("X2")}
          disabled={lifelines.X2}
        >
          Double Dip
        </button>

        <button
          className={`bg-yellow-500 text-white p-4 rounded-lg flex-1 min-w-[120px] ${
            lifelines.askTheAudience ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => handleLifelineClick("askTheAudience")}
          disabled={lifelines.askTheAudience}
        >
          Ask the Audience
        </button>
      </div>
    </div>
  );
};

export default LifelineWindow;
