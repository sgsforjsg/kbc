import React, { useState } from 'react';
import fiftyFiftyImg from './images/5050.jpg'; // Import image
import doubleDipImg from './images/2x.jpg';   // Import image
import audiencePollImg from './images/audience.jpg'; // Import image

const Lifelines = ({ questionData }) => {
  const [isUsed, setIsUsed] = useState({
    fiftyFifty: false,
    doubleDip: false,
    audiencePoll: false,
  });

  const handleUseLifeline = (lifeline) => {
    setIsUsed((prev) => ({
      ...prev,
      [lifeline]: true,
    }));
  };

  return (
    <div className="flex flex-row items-center justify-center space-x-8 mt-10">
      {/* 50:50 Lifeline */}
     { console.log('Fetched data1:', questionData.buttonStates.lock)}
      {questionData && questionData.ans === 2 && ( // Check if ans is 1 to show 50:50 button
        <button
          onClick={() => handleUseLifeline('fiftyFifty')}
          disabled={isUsed.fiftyFifty}
          className={`${
            isUsed.fiftyFifty ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } flex items-center justify-center w-32 h-32 rounded-full transform transition-all duration-500 hover:scale-110`}
        >
          <img
            src={fiftyFiftyImg} // Use the imported image
            alt="50:50"
            className="w-16 h-16"
          />
        </button>
      )}

      {/* Double Dip Lifeline */}
      <button
        onClick={() => handleUseLifeline('doubleDip')}
        disabled={isUsed.doubleDip}
        className={`${
          isUsed.doubleDip ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
        } flex items-center justify-center w-32 h-32 rounded-full transform transition-all duration-500 hover:scale-110`}
      >
        <img
          src={doubleDipImg} // Use the imported image
          alt="Double Dip"
          className="w-16 h-16"
        />
      </button>

      {/* Audience Poll Lifeline */}
      <button
        onClick={() => handleUseLifeline('audiencePoll')}
        disabled={isUsed.audiencePoll}
        className={`${
          isUsed.audiencePoll ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
        } flex items-center justify-center w-32 h-32 rounded-full transform transition-all duration-500 hover:scale-110`}
      >
        <img
          src={audiencePollImg} // Use the imported image
          alt="Audience Poll"
          className="w-16 h-16"
        />
      </button>
    </div>
  );
};

export default Lifelines;
