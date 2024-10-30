import { useState, useEffect } from 'react';
import { ref, set, update } from 'firebase/database';
import { doc, updateDoc, collection } from 'firebase/firestore';
import { db1 } from '../firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import Timer from '../components/Timer';
import LifelineWindow from '../components/LifelineWindow';
import MediaPlayer from '../components/MediaPlayer';
import { useMedia } from '../context/MediaContext';
import { Howl, Howler } from 'howler';  // Import Howler.js

// Import sound files
import rongSound from '../components/sounds/gameover.wav';
import clapa from '../components/sounds/clap (a).mp3';
import clapb from '../components/sounds/clap (b).mp3';
import clapc from '../components/sounds/clap (c).mp3';
import clapd from '../components/sounds/clap (d).mp3';
import clape from '../components/sounds/clap (e).mp3';
import clapf from '../components/sounds/clap (f).mp3';
import clapg from '../components/sounds/clap (g).mp3';
import claph from '../components/sounds/clap (h).mp3';
import kbcAsk from '../components/sounds/kbc_5_newest.mp3';
import suspA from '../components/sounds/suspense.wav';

const GameConsole = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setNo, filteredQuestions } = location.state || {};
  const { mediaFiles } = useMedia();

  const [showTimer, setShowTimer] = useState(false);
  const [showLifelineWindow, setShowLifelineWindow] = useState(false);
  const [lifelines, setLifelines] = useState({
    fiftyFifty: false,
    phoneAFriend: false,
    askTheAudience: false,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [askQuestion, setAskQuestion] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [lockVisible, setLockVisible] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const prizeMoney = [
    "₹1,000", "₹2,000", "₹3,000", "₹5,000", "₹10,000",
    "₹20,000", "₹40,000", "₹80,000", "₹160,000", "₹320,000",
    "₹500,000", "₹1,000,000", "₹3,000,000", "₹5,000,000", "₹10,000,000"
  ];

  // Initialize Howl instances for sounds
  const rongSoundAudio = new Howl({ src: [rongSound] });
  const kbcAskAudio = new Howl({ src: [kbcAsk] });
  const suspenseAudio = new Howl({ src: [suspA] });

  const audioFiles = [
    new Howl({ src: [clapa] }),
    new Howl({ src: [clapb] }),
    new Howl({ src: [clapc] }),
    new Howl({ src: [clapd] }),
    new Howl({ src: [clape] }),
    new Howl({ src: [clapf] }),
    new Howl({ src: [clapg] }),
    new Howl({ src: [claph] }),
  ];

  const stopAllAudio = () => {
    console.log('Stopping all audio');
    Howler.stop();  // Stop all playing sounds using Howler's global control
  };

  useEffect(() => {
    if (filteredQuestions.length > 0) {
      setCurrentQuestion(filteredQuestions[0]);
      setCorrectAnswer(filteredQuestions[0].ans);
    }
  }, [filteredQuestions]);

  const handleAsk = () => {
    kbcAskAudio.play();
    setTimeout(() => {
      setAskQuestion(true);
    }, 3000);
  };

  const handleShowOptions = () => setOptionsVisible(true);

  const handleLockAnswer = () => {
    if (!selectedAnswer) return;
    setLockVisible(true);
    setIsLocked(true);
  };

  const handleResult = () => {
    const isCorrect = selectedAnswer?.toLowerCase() === currentQuestion.true_ans.toLowerCase();
    setShowResult(true);
    setResultVisible(true);

    if (isCorrect) {
      const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];
      stopAllAudio();
      randomAudio.play();
    } else {
      rongSoundAudio.play();
    }
  };

  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < filteredQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(filteredQuestions[nextIndex]);
      setCorrectAnswer(filteredQuestions[nextIndex].answer);
      setSelectedAnswer(null);
      setShowResult(false);
      setOptionsVisible(false);
      setLockVisible(false);
      setResultVisible(false);
      setAskQuestion(false);
      setIsLocked(false);
      handleAsk();
    } else {
      alert('No more questions in this set.');
    }
  };

  const handleCloseGame = () => navigate('/game');

  const toggleTimer = () => setShowTimer(!showTimer);

  const toggleLifelineWindow = () => setShowLifelineWindow(!showLifelineWindow);

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-blue-1000 overflow-hidden flex">
      {/* Timer */}
      {showTimer && <div className="absolute top-10 left-[40%]"><Timer /></div>}

      {/* Main Game Area */}
      <div className="flex justify-center items-start bg-gray-900 w-4/5 h-full p-8">
        {/* Question and Options */}
        <div className="absolute top-[15%] left-[1%] w-3/4 h-1/2 bg-gray-800 p-8 rounded-lg text-white">
          {askQuestion && currentQuestion && (
            <>
              <p className="text-2xl mb-6">{currentQuestion.question}</p>
              {optionsVisible && (
                <div className="grid grid-cols-2 gap-4">
                  {['A', 'B', 'C', 'D'].map((label, idx) => {
                    const option = currentQuestion[label];
                    const correctOption = currentQuestion.true_ans.toLowerCase();
                    const isSelected = label.toLowerCase() === selectedAnswer?.toLowerCase();
                    const bgColor = isSelected ? 'bg-blue-500' : 'bg-gray-200';

                    return (
                      <button
                        key={idx}
                        className={`p-4 rounded-lg ${bgColor}`}
                        onClick={() => setSelectedAnswer(label)}
                        disabled={showResult}
                      >
                        <span className="font-bold mr-2">{label}.</span> {option}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Side - Prize Money */}
      <div className="w-1/5 h-full bg-gray-800 mt-3">
        <ul className="space-y-3 text-lg font-semibold ml-5 text-white">
          {prizeMoney.slice().reverse().map((amount, index) => (
            <li key={index} className="text-white">{prizeMoney.length - index}: {amount}</li>
          ))}
        </ul>
      </div>

      {/* Bottom Buttons */}
      <div className="absolute bottom-8 left-0 right-0 flex space-x-4">
        <button onClick={handleAsk}>Ask</button>
        <button onClick={handleShowOptions}>Show</button>
        <button onClick={stopAllAudio}>Stop Music</button>
        <button onClick={handleLockAnswer}>Lock</button>
        <button onClick={handleResult}>Result</button>
        <button onClick={handleNext}>Next</button>
        <button onClick={toggleTimer}>Toggle Timer</button>
        <button onClick={toggleLifelineWindow}>Toggle Lifelines</button>
        <button onClick={handleCloseGame}>Close Game</button>
      </div>

      {/* Lifeline Window */}
      {showLifelineWindow && <LifelineWindow />}
    </div>
  );
};

export default GameConsole;
