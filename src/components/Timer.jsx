import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';

// Import or provide URLs for the audio files
import startSound from './sounds/suspense.wav';
import warningSound from './sounds/clock.wav';
import endSound from './sounds/gameover.wav';

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(30); // Start the timer from 30 seconds
  const [isRunning, setIsRunning] = useState(true); // Track if the timer is running

  // Store a ref to the currently playing sound
  const currentAudioRef = useRef(null);

  // Helper function to stop the currently playing sound
  const stopCurrentAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.stop(); // Stop the current audio if it exists
      currentAudioRef.current = null; // Clear the ref
    }
  };

  // Initialize Howl instances for each sound
  const startAudio = new Howl({ src: [startSound] });
  const warningAudio = new Howl({ src: [warningSound] });
  const endAudio = new Howl({ src: [endSound] });

  // Play a sound and ensure no other sound plays simultaneously
  const playAudio = (audio) => {
    stopCurrentAudio(); // Stop any currently playing sound
    audio.play(); // Play the new audio
    currentAudioRef.current = audio; // Set the new audio as the current audio
  };

  // Play the start sound when the timer begins
  useEffect(() => {
    if (isRunning) {
      playAudio(startAudio);
    }
  }, [isRunning]);

  // Effect to manage countdown and play sounds at specific times
  useEffect(() => {
    let timerId;

    if (isRunning && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    // Play the warning sound when 5 seconds are left
    if (timeLeft === 5) {
      playAudio(warningAudio);
    }

    // Play the end sound when the timer reaches 0
    if (timeLeft === 0) {
      playAudio(endAudio);
      clearInterval(timerId);
    }

    return () => clearInterval(timerId); // Cleanup interval on unmount or timeLeft change
  }, [isRunning, timeLeft]);

  // Stop all sounds and reset audio when needed
  const stopAllSounds = () => {
    stopCurrentAudio(); // Stop any currently playing sound
  };

  // Handle timer click to stop both the timer and sounds
  const handleTimerClick = () => {
    setIsRunning(false);
    stopAllSounds();
  };

  // Cleanup sounds when the component unmounts
  useEffect(() => {
    return () => stopAllSounds();
  }, []);

  // Format the time to always show two digits (e.g., 09 instead of 9)
  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  return (
    <div
      className="relative flex items-center justify-center bg-lightblue text-white rounded-full w-20 h-20 text-6xl font-bold" // Adjusted size and font
      onClick={handleTimerClick}
      style={{ cursor: 'pointer' }} // Pointer cursor to indicate it's clickable
    >
      {formatTime(timeLeft)}
    </div>
  );
};

export default Timer;
