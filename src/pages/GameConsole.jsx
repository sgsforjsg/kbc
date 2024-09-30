import { useState, useEffect } from 'react';
import { ref, set, update } from 'firebase/database';
import { doc, updateDoc, collection } from 'firebase/firestore';
import { db1 } from '../firebase'; // Import your Firestore setup
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import Timer from '../components/Timer';
import LifelineWindow from '../components/LifelineWindow'; // Import the LifelineWindow component

const GameConsole = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const { setNo, filteredQuestions } = location.state || {}; // Get setNo and filteredQuestions from location.state
  const [showTimer, setShowTimer] = useState(false); // State to track the visibility of the timer
  const [showLifelineWindow, setShowLifelineWindow] = useState(false); // State for showing/hiding lifeline window
  const [lifelines, setLifelines] = useState({
    fiftyFifty: false,
    phoneAFriend: false,
    askTheAudience: false,
  });

  const toggleTimer = () => {
    setShowTimer(!showTimer); // Toggle between showing and hiding the timer
  };

  const toggleLifelineWindow = () => {
    setShowLifelineWindow(!showLifelineWindow); // Toggle lifeline window
  };

  const handleLifelineClick = (lifeline) => {
    setLifelines((prev) => ({
      ...prev,
      [lifeline]: true,
    }));
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [askQuestion, setAskQuestion] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [lockVisible, setLockVisible] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // To track if the answer is locked

  const prizeMoney = [
    "₹1,000", "₹2,000", "₹3,000", "₹5,000", "₹10,000",
    "₹20,000", "₹40,000", "₹80,000", "₹160,000", "₹320,000",
    "₹500,000", "₹1,000,000", "₹3,000,000", "₹5,000,000", "₹10,000,000"
  ];

  useEffect(() => {
    if (filteredQuestions.length > 0) {
      setCurrentQuestion(filteredQuestions[0]);
      setCorrectAnswer(filteredQuestions[0].ans);
    }
  }, [filteredQuestions]);
  console.log('consol',filteredQuestions)

  const handleAsk = () => {
    setAskQuestion(true);
  };

  const handleShowOptions = () => {
    setOptionsVisible(true);
  };

  const handleLockAnswer = () => {
    if (!selectedAnswer) return;
    setLockVisible(true);
    setIsLocked(true); // Stop blinking when locked
  };

  const handleResult = () => {
    setShowResult(true);
    setResultVisible(true);
  };

  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;
   
    if (nextIndex < filteredQuestions.length) {
      console.log('handel next') 
      setCurrentQuestionIndex(nextIndex);

      setCurrentQuestion(filteredQuestions[nextIndex]);
      setCorrectAnswer(filteredQuestions[nextIndex].answer);
      console.log('f',filteredQuestions)
      setSelectedAnswer(null); // Reset selected option
      setShowResult(false);
      setOptionsVisible(false);
      setLockVisible(false);
      setResultVisible(false);
      setAskQuestion(false);
      setIsLocked(false); // Reset lock state
    } else {
      alert('No more questions in this set.');
    }
  };

  const handleCloseGame = () => {
    // Navigate back to the GameSetup screen
    navigate('/game');
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  // Inline style for the blinking effect
  const blinkingStyle = {
    animation: 'blinking 1s infinite'
  };

  // Inject the keyframes for blinking animation
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

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-blue-1000 overflow-hidden flex">
      {/* Left + Center - Game Area (Takes 80% of the screen) */}
      {showTimer && (
        <div className="absolute top-10 left-[40%]">
          <Timer />
        </div>
      )}
      <div className="flex justify-center items-start  bg-gray-900 w-4/5 h-full p-8">
        {/* Top Aligned Question and Options */}
        <div className=" absolute top-[15%] left-[1%] w-1/2 h-1/2 bg-gray-800 p-8 rounded-lg text-white">
          {askQuestion && currentQuestion && (
            <>
              <h3 className="text-xl font-bold mb-4">Question {currentQuestion.qNo}</h3>
              <p className="text-2xl mb-6">{currentQuestion.question}</p>
              {optionsVisible && (
                <div className="grid grid-cols-2 gap-4 w-full">
                {['A', 'B', 'C', 'D'].map((label, idx) => {
                  const option = currentQuestion[label]; // Access option using label (A, B, C, D)
                  const correctOption = currentQuestion.true_ans.toLowerCase(); // The correct option (e.g., 'a', 'b', etc.)
                  const isCorrect = label.toLowerCase() === correctOption; // Check if the current option is the correct one
                  const isSelected = label.toLowerCase() === selectedAnswer?.toLowerCase(); // Check if this option is selected
              
                  let bgColor = 'bg-gray-200 text-black'; // Default background
                  let appliedStyle = {}; // This will store the blinking or default styles
              
                  if (showResult) {
                    if (isCorrect) bgColor = 'bg-green-500 text-white'; // Correct answer in green
                    else if (isSelected && !isCorrect) bgColor = 'bg-red-500 text-white'; // Wrong selected answer in red
                  } else if (isSelected) {
                    bgColor = 'bg-blue-500 text-white'; // Highlight selected option in blue
              
                    // Apply the blinking effect only if the answer is not locked
                    if (!isLocked) {
                      appliedStyle = blinkingStyle;
                    }
                  }
              
                  return (
                    <button
                      key={idx}
                      className={`p-4 rounded-lg ${bgColor}`}
                      style={appliedStyle} // Apply blinking or default styles here
                      onClick={() => setSelectedAnswer(label)} // Set the selected answer to the label (A, B, C, or D)
                      disabled={showResult} // Disable buttons if result is shown
                    >
                      <span className="font-bold mr-2">{label}.</span> {option} {/* Display label (A, B, C, D) and option text */}
                    </button>
                  );
                })}
              </div>
              
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Side - Prize Money Ladder (Takes 20% of the screen) */}
      <div className="right-0 w-1/5 h-full bg-gray-800 mt-3 ">
        <ul className="text-left space-y-3 text-lg font-semibold ml-5 text-white">
          {prizeMoney
            .slice()
            .reverse()
            .map((amount, index) => (
              <li
                key={index}
                className={`${
                  currentQuestionIndex === prizeMoney.length - 1 - index
                    ? 'text-yellow-400 font-extrabold'
                    : 'text-white'
                }`}
              >
                {prizeMoney.length - index}: {amount}
              </li>
            ))}
        </ul>
      </div>

      {/* Bottom Buttons */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-left space-x-4">
        <button
          className="bg-blue-500 text-white p-4 rounded-lg"
          onClick={handleAsk}
          disabled={askQuestion}
        >
          Ask
        </button>
        <button
          className="bg-blue-500 text-white p-4 rounded-lg"
          onClick={handleShowOptions}
          disabled={!askQuestion || optionsVisible}
        >
          Show
        </button>
        <button
          className="bg-red-500 text-white p-4 rounded-lg"
          onClick={handleLockAnswer}
          disabled={!selectedAnswer || lockVisible}
        >
          Lock
        </button>
        <button
          className="bg-green-500 text-white p-4 rounded-lg"
          onClick={handleResult}
          disabled={!lockVisible || resultVisible}
        >
          Result
        </button>
        <button
          className="bg-purple-500 text-white p-4 rounded-lg"
          onClick={handleNext}
          disabled={!resultVisible}
        >
          Next
        </button>
        <button 
          className="bg-blue-500 text-white p-2 rounded-lg" 
          onClick={toggleTimer}
        >
          {showTimer ? 'Hide Timer' : 'Show Timer'}
        </button>
        <button 
          className="bg-orange-500 text-white p-2 rounded-lg"
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

      {/* Lifeline Window */}
      {showLifelineWindow && (
        <LifelineWindow lifelines={lifelines} onLifelineClick={handleLifelineClick} />
      )}
    </div>
  );
}

export default GameConsole;
