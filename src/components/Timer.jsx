import { useState, useEffect, useRef } from 'react';

// You can import sound files or use URLs directly
import startSound from './sounds/suspense.wav'; // Replace with the actual path to your sound file
import warningSound from './sounds/clock.wav';
import endSound from './sounds/gameover.wav';

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(30); // Start the timer from 30 seconds
  const [isRunning, setIsRunning] = useState(true); // Track if the timer is running

  // Create refs for audio elements to persist them across renders
  const startAudioRef = useRef(new Audio(startSound));
  const warningAudioRef = useRef(new Audio(warningSound));
  const endAudioRef = useRef(new Audio(endSound));

  // Play the start sound once when the timer starts
  useEffect(() => {
    if (isRunning) {
      startAudioRef.current.play();
    }
  }, [isRunning]);

  // Effect to handle the countdown
  useEffect(() => {
    let timerId;

    if (isRunning && timeLeft > 0) {
      // Start a 1-second interval to update the timer
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    // Play warning sound at 5 seconds left
    if (timeLeft === 5) {
      warningAudioRef.current.play();
    }

    // Play end sound at 0 seconds left
    if (timeLeft === 0) {
      endAudioRef.current.play();
      clearInterval(timerId);
    }

    return () => clearInterval(timerId); // Clear interval on component unmount or when timeLeft changes
  }, [isRunning, timeLeft]);

  // Function to stop all sounds
  const stopAllSounds = () => {
    // Stop the start, warning, and end sounds
    startAudioRef.current.pause();
    warningAudioRef.current.pause();
    endAudioRef.current.pause();

    // Reset the current time of all audio elements
    startAudioRef.current.currentTime = 0;
    warningAudioRef.current.currentTime = 0;
    endAudioRef.current.currentTime = 0;
  };

  // Handle timer click to stop both the timer and all sounds
  const handleTimerClick = () => {
    setIsRunning(false);
    stopAllSounds();
  };

  // Cleanup effect to stop sounds when the component is unmounted
  useEffect(() => {
    return () => {
      // This will run when the component is unmounted (e.g., hidden)
      stopAllSounds();
    };
  }, []);

  // Format the time to show two digits (e.g., 09 instead of 9)
  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  return (
    <div
      className="relative flex items-center justify-center bg-lightblue text-white rounded-full w-16 h-16 text-6xl font-bold" // Increased w, h, and added text-4xl for larger font
      onClick={handleTimerClick}
      style={{ cursor: 'pointer' }} // Pointer cursor to indicate it's clickable
    >
      {formatTime(timeLeft)}
    </div>
  );
};

export default Timer;
