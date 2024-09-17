import React, { useState } from 'react';

const GameConsole = ({ setNo, filteredQuestions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionDisplayed, setQuestionDisplayed] = useState(false);
  const [lifelineChecked, setLifelineChecked] = useState(false);
  const [usedLifelines, setUsedLifelines] = useState({ life1: false, life2: false, life3: false });

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleStart = () => {
    setQuestionDisplayed(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert('No more questions.');
    }
  };

  const handleLifelineCheck = (e) => {
    setLifelineChecked(e.target.checked);
  };

  const handleLifelineUse = (lifeline) => {
    setUsedLifelines((prev) => ({ ...prev, [lifeline]: true }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Display Question */}
      {questionDisplayed && currentQuestion && (
        <div className="mb-6 p-4 bg-white border rounded shadow-md">
          <h2 className="text-xl font-bold mb-2">Question {currentQuestion.qNo}: {currentQuestion.question}</h2>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button key={index} className="block w-full text-left px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Buttons for Start and Next */}
      {!questionDisplayed ? (
        <button onClick={handleStart} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Start
        </button>
      ) : (
        <button onClick={handleNext} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Next
        </button>
      )}

      {/* Lifeline Checkboxes */}
      {questionDisplayed && (
        <div className="mt-4 mb-6 p-4 bg-white border rounded shadow-md">
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={lifelineChecked}
              onChange={handleLifelineCheck}
              className="mr-2"
            />
            Use Lifeline
          </label>

          {lifelineChecked && (
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  disabled={usedLifelines.life1}
                  onChange={() => handleLifelineUse('life1')}
                  className="mr-2"
                />
                Lifeline 1
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  disabled={usedLifelines.life2}
                  onChange={() => handleLifelineUse('life2')}
                  className="mr-2"
                />
                Lifeline 2
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  disabled={usedLifelines.life3}
                  onChange={() => handleLifelineUse('life3')}
                  className="mr-2"
                />
                Lifeline 3
              </label>
            </div>
          )}
        </div>
      )}

      {/* Additional buttons */}
      {questionDisplayed && (
        <div className="mt-6 space-x-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Post
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Play Media
          </button>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
            Show
          </button>
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Play Sound
          </button>
          <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
            Play Claps
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Lock
          </button>
          <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
            Results
          </button>
        </div>
      )}
    </div>
  );
};

export default GameConsole;
