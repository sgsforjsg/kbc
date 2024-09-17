import React from 'react';

const GameControls = ({
  lifelineChecked,
  setLifelineChecked,
  life1,
  setLife1,
  life2,
  setLife2,
  life3,
  setLife3,
  currentQuestion,
}) => {
  return (
    <div className="controls-section">
      {/* Lifeline and Life buttons */}
      <div className="lifeline-controls">
        <label>
          <input
            type="checkbox"
            checked={lifelineChecked}
            onChange={() => setLifelineChecked(!lifelineChecked)}
          />
          Lifeline
        </label>

        <label>
          <input
            type="checkbox"
            checked={life1}
            onChange={() => setLife1(!life1)}
            disabled={!lifelineChecked || life1}
          />
          Life 1
        </label>

        <label>
          <input
            type="checkbox"
            checked={life2}
            onChange={() => setLife2(!life2)}
            disabled={!lifelineChecked || life2}
          />
          Life 2
        </label>

        <label>
          <input
            type="checkbox"
            checked={life3}
            onChange={() => setLife3(!life3)}
            disabled={!lifelineChecked || life3}
          />
          Life 3
        </label>
      </div>

      {/* Other buttons */}
      <div className="other-controls">
        <button onClick={() => console.log('Post')}>Post</button>
        <button onClick={() => console.log('Play Media')}>Play Media</button>
        <button onClick={() => console.log('Show')}>Show</button>
        <button onClick={() => console.log('Play Sound')}>Play Sound</button>
        <button onClick={() => console.log('Play Claps')}>Play Claps</button>
        <button onClick={() => console.log('Lock')}>Lock</button>
        <button onClick={() => console.log('Result')}>Result</button>

        {/* Options from current question */}
        {currentQuestion.options.map((option, idx) => (
          <button key={idx}>{option}</button>
        ))}
      </div>
    </div>
  );
};

export default GameControls;
