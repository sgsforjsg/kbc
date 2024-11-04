import { useState, useEffect } from 'react';
import { ref, set, update } from 'firebase/database';
import { doc, updateDoc, collection } from 'firebase/firestore';
import { db1 } from '../firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import Timer from '../components/Timer';
import LifelineWindow from '../components/LifelineWindow';
import MediaPlayer from '../components/MediaPlayer';
import { useMedia } from '../context/MediaContext';
import { Howl, Howler } from 'howler';
import WinningPopup from './WinningPopup';

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
  const [showTimer, setShowTimer] = useState(false);
  const [showLifelineWindow, setShowLifelineWindow] = useState(false);
  const [lifelines, setLifelines] = useState({
    fiftyFifty: false,
    X2: false,
    askTheAudience: false,
  });




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
    Howler.stop();
  };

  const toggleTimer = () => {
    setShowTimer(!showTimer);
  };

  const toggleLifelineWindow = () => {
    setShowLifelineWindow(!showLifelineWindow);
  };

  const handleLifelineClick = (lifeline) => {
    setLifelines((prev) => ({
      ...prev,
      [lifeline]: true,
    }));

    if (lifeline === 'fiftyFifty' && currentQuestion?.L5050) {
      const optionsToHide = currentQuestion.L5050.split('').map(option => option.toUpperCase());
      setHiddenOptions(optionsToHide);

    }
    if (lifeline === "X2") {
      setx2Status(true)
      console.log('X2')
    }


  };
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [x2status,setx2Status]=useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
 
const [secondAnswer, setSecondAnswer] = useState(null); // Track the second selection (for X2 lifeline)

  const [showResult, setShowResult] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [askQuestion, setAskQuestion] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [lockVisible, setLockVisible] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [wrongx, setWrongx] = useState(0)

  const prizeMoney = [
   "0", "₹1,000", "₹2,000", "₹3,000", "₹5,000", "₹10,000",
    "₹20,000", "₹40,000", "₹80,000", "₹1,60,000", "₹3,20,000",
    "₹6,40,000", "₹12,50,000", "₹25 Lakh", "₹50 Lakh", "₹ 1 Crore"
  ];

  useEffect(() => {
    if (lifelines.fiftyFifty) {
      console.log("50-50 lifeline has been activated!");
    } else {
      console.log("50-50 lifeline is inactive.");
    }
    if (lifelines.X2) {
      console.log("X2")
    }

  }, [lifelines.fiftyFifty, lifelines.X2]);



  useEffect(() => {
    if (filteredQuestions.length > 0) {
      setCurrentQuestion(filteredQuestions[0]);
      setCorrectAnswer(filteredQuestions[0].ans);
    }
  }, [filteredQuestions]);

  const handleOptionSelect = (label) => {
    
      setSelectedAnswer(label); // First selection
   if (x2status && !secondAnswer) {
      setSecondAnswer(label); // Second selection if X2 is active
    }
  };

  const handleAsk = () => {
    kbcAskAudio.play();
    setTimeout(() => {
      setAskQuestion(true);
    }, 3000);
  };

  const handleShowOptions = () => {
    setOptionsVisible(true);
  };

  const handleLockAnswer = () => {
    if (!selectedAnswer) return;
    setLockVisible(true);
    setIsLocked(true);
  };

  const handleResult = () => {
   // const isCorrect = selectedAnswer?.toLowerCase() === currentQuestion.true_ans.toLowerCase();
   const isCorrect = 
  selectedAnswer?.toLowerCase() === currentQuestion.true_ans.toLowerCase() || 
  secondAnswer?.toLowerCase() === currentQuestion.true_ans.toLowerCase();
   
   setShowResult(true);
    setResultVisible(true);

    if (!isCorrect) {
      if (currentQuestionIndex < 4) {
        setWrongx(currentQuestionIndex);
      }
      if (currentQuestionIndex >= 4 && currentQuestionIndex < 10) {
        setWrongx(currentQuestionIndex - 4);
      } if (currentQuestionIndex >= 10) {
        setWrongx(currentQuestionIndex - 9);
      }


      rongSoundAudio.play()
     // setWrongx(0);
      openPopup();
    } else {
      const randomIndex = Math.floor(Math.random() * audioFiles.length);
      const randomAudio = audioFiles[randomIndex];
      stopAllAudio();
      setWrongx(-1);
      openPopup();
      randomAudio.play()
    }
  };




  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < filteredQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(filteredQuestions[nextIndex]);
      setCorrectAnswer(filteredQuestions[nextIndex].answer);
      setSelectedAnswer(null);
      setSecondAnswer(null)
      setShowResult(false);
      setOptionsVisible(false);
      setLockVisible(false);
      setResultVisible(false);
      setAskQuestion(false);
      setIsLocked(false);
      handleAsk();
      setHiddenOptions([]);
      setx2Status(false)
    } else {
      alert('No more questions in this set.');
    }
  };

  const handleCloseGame = () => {
    navigate('/game');
  };

  const optionLabels = ['A', 'B', 'C', 'D'];
  const blinkingStyle = { animation: 'blinking 1s infinite' };

  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    const keyframes = `
      @keyframes blinking {
        0% { opacity: 1; }
        50% { opacity: 0; }
        100% { opacity: 1; }
      }
    `;
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  }, []);

  // winning  popup screen
  const [isPopupVisible, setIsPopupVisible] = useState(false);


  const winningInfo = ` won ${prizeMoney[currentQuestionIndex - wrongx]}!`;

  const openPopup = () => setIsPopupVisible(true);
  const closePopup = () => setIsPopupVisible(false);

  // popup code over
  console.log(prizeMoney[currentQuestionIndex])

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-blue-1000 overflow-hidden flex">
      {showTimer && (
        <div className="absolute top-4 left-[40%]">
          <Timer />
        </div>
      )}
      <div className="flex justify-center items-start bg-gray-900 w-4/5 h-full p-8">
        <div className="absolute top-[15%] left-[1%] w-3/4 h-1/2 bg-gray-800 p-8 rounded-lg text-white">
        {askQuestion && currentQuestion && (
    <>
      <p className="text-2xl mb-6">{currentQuestion.question}</p>
      {optionsVisible && (
  <div className="grid grid-cols-2 gap-4 w-full">
    {['A', 'B', 'C', 'D'].map((label, idx) => {
      if (hiddenOptions.includes(label)) return null;

      const option = currentQuestion[label];
      const correctOption = currentQuestion.true_ans.toLowerCase();
      const isCorrect = label.toLowerCase() === correctOption;
      const isSelected =
        label.toLowerCase() === selectedAnswer?.toLowerCase() || 
        label.toLowerCase() === secondAnswer?.toLowerCase();

      let bgColor = 'bg-gray-200 text-black';
      let appliedStyle = {};

      if (showResult) {
        bgColor = isCorrect 
          ? 'bg-green-500 text-white' 
          : isSelected && !isCorrect 
          ? 'bg-red-500 text-white' 
          : bgColor;
      } else if (isSelected) {
        bgColor = 'bg-blue-500 text-white';
        if (!isLocked) appliedStyle = blinkingStyle;
      }

      // Disable button if locked or selection criteria met
      const isDisabled =  showResult 
       

      return (
        <button
          key={idx}
          className={`p-4 rounded-lg ${bgColor}`}
          style={appliedStyle}
          onClick={() => handleOptionSelect(label)}
          disabled={showResult}
        >
          <span className="font-bold mr-2">{label}.</span> {option}
        </button>
      );
    })}
  </div>
)}


      {isPopupVisible && (
        <WinningPopup onClose={closePopup} winningInfo={winningInfo} />
      )}
    </>
  )}
        </div>
      </div>

      <div className="right-0 w-1/5 h-full bg-gray-800 mt-3">
        <ul className="text-left space-y-3 text-lg font-semibold ml-5 text-white">
          {prizeMoney
            .slice()
            .reverse()
            .map((amount, index) => {
              const isCurrent = currentQuestionIndex === prizeMoney.length -2 - index;
              const isSpecialIndex = index === 5 || index === 10;
              return (
                <li
                  key={index}
                  className={`${isCurrent ? 'text-yellow-400 font-extrabold' : 'text-white'} ${isSpecialIndex ? 'font-bold text-yellow-100  italic text-bright' : ''
                    }`}
                >
                  {prizeMoney.length - index-1}: {amount}
                </li>
              );
            })}
        </ul>

      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-left space-x-4">
        <button
          className={`p-4 rounded-lg ${askQuestion ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          onClick={handleAsk}
          disabled={askQuestion}
        >
          Ask
        </button>

        <div className="w-10% h-5">
          {currentQuestion && currentQuestion['media link'] !== 'a' && (
            <MediaPlayer mediaLink={currentQuestion['media link']} qid={currentQuestion['ID']} />
          )}
        </div>

        <button
          className={`p-4 rounded-lg ${askQuestion && !optionsVisible ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          onClick={handleShowOptions}
          disabled={!askQuestion || optionsVisible}
        >
          Show
        </button>

        <button
          className={`p-4 rounded-lg bg-blue-500 text-white`}
          onClick={stopAllAudio}
        >
          Stop Music
        </button>

        <button
          className={`p-4 rounded-lg ${selectedAnswer && !lockVisible ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          onClick={handleLockAnswer}
          disabled={!selectedAnswer || lockVisible}
        >
          Lock
        </button>

        <button
          className={`p-4 rounded-lg ${lockVisible && !resultVisible ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          onClick={handleResult}
          disabled={!lockVisible || resultVisible}
        >
          Result
        </button>

        <button
          className={`p-4 rounded-lg ${resultVisible ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          onClick={handleNext}
          disabled={!resultVisible}
        >
          Next
        </button>

        <button
          className={`p-2 rounded-lg ${showTimer ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          onClick={toggleTimer}
        >
          {showTimer ? 'Hide Timer' : 'Show Timer'}
        </button>

        <button
          className={`p-2 rounded-lg ${showLifelineWindow ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          onClick={toggleLifelineWindow}
        >
          {showLifelineWindow ? 'Hide Lifelines' : 'Show Lifelines'}
        </button>

        <button
          className="bg-gray-500 text-white p-4 rounded-lg"
          onClick={handleCloseGame}
        >
          Close Game
        </button>
      </div>

      {showLifelineWindow && (
        <LifelineWindow
          onLifelineClick={handleLifelineClick}
          lifelines={lifelines}
        />
      )}
    </div>
  );
};

export default GameConsole;
