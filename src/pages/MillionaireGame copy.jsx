import React, { useState, useEffect } from 'react';
import { db1 } from '../firebase'; // Firebase config
import { ref, onValue } from 'firebase/database'; // Firebase methods

const KBCGame = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Tracks the current question
  const [questions, setQuestions] = useState([]); // Holds questions from Firebase
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true); // Controls the welcome screen visibility

  const prizeMoney = [
    "₹ 1,000", "₹ 2,000", "₹ 3,000", "₹ 5,000", "₹ 10,000",
    "₹ 20,000", "₹ 40,000", "₹ 80,000", "₹ 1,60,000", "₹ 3,20,000",
    "₹ 6,40,000", "₹ 12,50,000", "₹ 25,00,000", "₹ 50,00,000", "₹ 1 Crore",
  ];

  // Handle selecting an answer
  const handleSelectAnswer = (option) => {
    if (!isAnswerLocked) setSelectedAnswer(option);
  };

  // Handle locking the answer
  const handleLockAnswer = () => {
    setIsAnswerLocked(true);
  };

  // Handle showing the answer
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  // Handle moving to the next question
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerLocked(false);
    setShowAnswer(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle starting the game (hide welcome screen)
  const handleStartGame = () => {
    setShowWelcomeScreen(false);
  };

  // Fetch questions from Firebase Realtime Database in real-time
  useEffect(() => {
    const questionsRef = ref(db1, 'askedQuestions/q'); // Replace 'q' with your actual path in Firebase
    const unsubscribe = onValue(questionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedQuestions = Object.values(data); // Convert object to array
        setQuestions(formattedQuestions);
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-black via-blue-900 to-black text-white flex items-center justify-center overflow-hidden fixed inset-0">
      {/* Welcome Screen */}
      {showWelcomeScreen && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-10">
          <div className="text-5xl font-bold tracking-wide text-yellow-500 mb-8">Kaun Banega Crorepati</div>
          <div className="flex space-x-6 mb-8">
            {/* Lifeline Buttons */}
            <button className="p-4 bg-gray-700 rounded-full hover:bg-gray-600">50:50</button>
            <button className="p-4 bg-gray-700 rounded-full hover:bg-gray-600">Audience Poll</button>
            <button className="p-4 bg-gray-700 rounded-full hover:bg-gray-600">Double Dip</button>
          </div>
          <button
            className="py-3 px-10 bg-yellow-500 rounded-full text-lg font-bold hover:bg-yellow-400"
            onClick={handleStartGame}
          >
            Start
          </button>
        </div>
      )}

      {/* Main Game Section */}
      {!showWelcomeScreen && questions.length > 0 ? (
        <div className="flex w-full h-full max-w-5xl items-start">
          {/* Left Side - Question and Options */}
          <div className="w-3/4 h-full p-6 bg-black bg-opacity-60 rounded-lg shadow-lg text-center flex flex-col justify-between">
            <div className="text-2xl mb-6 font-semibold">{currentQuestion.question}</div>
            <div className="grid grid-cols-2 gap-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`py-4 px-8 rounded-full text-lg font-bold transition-all duration-200 border-2 ${
                    selectedAnswer === option ? 'bg-yellow-500 border-yellow-500' : 'bg-blue-800 border-blue-600 hover:bg-blue-700'
                  } ${
                    isAnswerLocked && option === currentQuestion.answer ? 'border-4 border-green-500' : ''
                  }`}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={isAnswerLocked}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-8 justify-center">
              <button
                className={`py-3 px-10 bg-yellow-500 rounded-full text-lg font-bold ${isAnswerLocked ? 'opacity-50' : 'hover:bg-yellow-400'}`}
                onClick={handleLockAnswer}
                disabled={isAnswerLocked || !selectedAnswer}
              >
                Lock Answer
              </button>
              <button
                className="py-3 px-10 bg-blue-500 rounded-full text-lg font-bold hover:bg-blue-400"
                onClick={handleShowAnswer}
              >
                Show Answer
              </button>
              <button
                className="py-3 px-10 bg-green-500 rounded-full text-lg font-bold hover:bg-green-400"
                onClick={handleNextQuestion}
              >
                Next Question
              </button>
            </div>

            {/* Result Section */}
            {showAnswer && (
              <div className="mt-6 text-2xl">
                {selectedAnswer === currentQuestion.answer ? (
                  <span className="text-green-400 font-bold">Correct Answer!</span>
                ) : (
                  <span className="text-red-400 font-bold">Wrong Answer!</span>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Prize Money Ladder */}
          <div className="w-1/4 h-full p-6 flex items-center">
            <ul className="text-right space-y-3 text-lg font-semibold w-full">
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
        </div>
      ) : (
        <div className="text-2xl font-bold text-white">
          Loading questions or no questions available. Please check Firebase.
        </div>
      )}
    </div>
  );
};

export default KBCGame;
