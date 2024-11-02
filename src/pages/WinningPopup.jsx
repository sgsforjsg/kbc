import React, { useEffect } from "react";

const WinningPopup = ({ onClose, winningInfo }) => {
  useEffect(() => {
    // Close on any key press or after 20 seconds
    const handleKeyPress = () => onClose();
    const timer = setTimeout(() => onClose(), 5000);

    document.addEventListener("keydown", handleKeyPress);

    // Cleanup event listener and timer on component unmount
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-950 p-8 rounded-lg shadow-lg animate-bounce-in">
        <h2 className="text-2xl font-bold text-center mb-4">Congratulations!</h2>
        <p className="text-lg text-center mb-4">{winningInfo}</p>
        <button 
          onClick={onClose} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-4 mx-auto block"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WinningPopup;
