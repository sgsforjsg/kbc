import { useState, useEffect } from 'react';
import { ref, set ,update} from 'firebase/database';
import { collection, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db1 } from '../firebase'; // Import your Firestore setup

const GameConsole = ({ setNo, filteredQuestions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(null);

  // State for button logical values
  const [post, setPost] = useState('n');
  const [playMedia, setPlayMedia] = useState('n');
  const [show, setShow] = useState('n');
  const [playSound, setPlaySound] = useState('n');
  const [playClaps, setPlayClaps] = useState('n');
  const [lock, setLock] = useState('n');
  const [results, setResults] = useState('n');
  const [options, setOptions] = useState('n');
  
  // State for game control
  const [gameStarted, setGameStarted] = useState(false);

  // Handle starting the game
  const handleStart = () => {
    setGameStarted(true);
  };

  // Handle stopping the game
  const handleEnd = () => {
    setGameStarted(false);
    setCurrentQuestionIndex(0); // Reset question index if needed
    setSelectedAnswer(null);
    setShowResult(null);
  };

  // Handle posting the current question to `askedQuestions`


  const handlePost = async () => {
    console.log('post')
    if (!currentQuestion) {
      console.log('Error: Current question is null.');
      return;
    }
  
    try {
      // Define the base path for "askedQuestions" in RTDB
      const basePath = '/'; // Replace with your actual path
      console.log('basePath:', basePath);
  
      // Construct the complete path
      const path = `${basePath}/askedQuestions/${currentQuestion.qNo}`;
      console.log('path:', path);
  
      const data = {
        ...currentQuestion,
        buttonStates: {
          post,
          playMedia,
          show,
          playSound,
          playClaps,
          lock,
          results,
          options,
        },
      };
  
      console.log('data to be posted:', data);
  
      const databaseRef = ref(db1, path);
      console.log('databaseRef:', databaseRef);
  
      await set(databaseRef, data);
      console.log('Data posted successfully.');
  
      setPost(post === 'n' ? 'y' : 'n'); // Toggle post state upon success
    } catch (error) {
      console.error('Error posting question:', error);
      // Add user feedback (e.g., alert message)
    }
  };



   // Handle posting the current question to `askedQuestions`

  // Handle playing media
  const handlePlayMedia = async () => {
    setPlayMedia(playMedia === 'n' ? 'y' : 'n'); // Toggle playMedia state
  
    try {
      // Reference to the specific data in RTDB
      const dataRef = ref(db1, `askedQuestions/${currentQuestion.qNo}/buttonStates/playMedia`);
  
      // Update the playMedia value
      await update(dataRef, { playMedia });
  
      console.log('playMedia updated successfully');
    } catch (error) {
      console.error('Error updating playMedia:', error);
    }
  };

  // Handle showing the question
  const handleShow = () => {
    setShow(show === 'n' ? 'y' : 'n'); // Toggle show state
  };

  // Handle playing sound
  const handlePlaySound = () => {
    setPlaySound(playSound === 'n' ? 'y' : 'n'); // Toggle playSound state
  };

  // Handle playing claps
  const handlePlayClaps = () => {
    setPlayClaps(playClaps === 'n' ? 'y' : 'n'); // Toggle playClaps state
  };

  // Handle locking the answer
  const handleLock = async () => {
    if (!selectedAnswer) return;
    try {
      const docRef = doc(collection(db, 'askedQuestions'), String(currentQuestion.qNo));
      await updateDoc(docRef, { userAnswer: selectedAnswer });
      setLock(lock === 'n' ? 'y' : 'n'); // Toggle lock state
    } catch (error) {
      console.error('Error locking answer:', error);
    }
  };

  // Handle showing results
  const handleResults = () => {
    setResults(results === 'n' ? 'y' : 'n'); // Toggle results state
  };

  // Handle showing options
  const handleOptions = () => {
    setOptions(options === 'n' ? 'y' : 'n'); // Toggle options state
  };

  // Handle moving to the next question
  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < filteredQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(filteredQuestions[nextIndex]);
      setSelectedAnswer(null);
      setShowResult(null);
    } else {
      alert('No more questions in this set.');
    }
  };

  // Handle showing the result (comparing answers)
  const handleShowResult = () => {
    if (!selectedAnswer) return;
    const isCorrect = selectedAnswer === currentQuestion.ans;
    setShowResult(isCorrect ? 'Correct!' : 'Wrong Answer');
  };

  useEffect(() => {
    if (filteredQuestions.length > 0) {
      setCurrentQuestion(filteredQuestions[0]);
    }
  }, [filteredQuestions]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Game Console</h1>

      {/* Start/End button */}
      <div className="mb-4">
        {!gameStarted ? (
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={handleStart}
          >
            Start
          </button>
        ) : (
          <button
            className="bg-red-500 text-white p-2 rounded"
            onClick={handleEnd}
          >
            End
          </button>
        )}
      </div>

      {/* Show question */}
      {currentQuestion && gameStarted && (
        <div className="p-4 bg-white border rounded">
          <h3 className="text-lg font-bold">Question {currentQuestion.qNo}</h3>
          <p>{currentQuestion.question}</p>

          {/* Show options as checkboxes */}
          {options === 'y' && (
            <div className="my-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  className={`p-2 m-2 rounded ${selectedAnswer === option ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setSelectedAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex space-x-4">
            <button
              className={`p-2 rounded ${post === 'y' ? 'bg-green-500' : 'bg-blue-500'} text-white`}
              onClick={handlePost}
            >
              Post
            </button>
            <button
              className={`p-2 rounded ${playMedia === 'y' ? 'bg-green-500' : 'bg-blue-500'} text-white`}
              onClick={handlePlayMedia}
            >
              Play Media
            </button>
            <button
              className={`p-2 rounded ${show === 'y' ? 'bg-green-500' : 'bg-blue-500'} text-white`}
              onClick={handleShow}
            >
              Show
            </button>
            <button
              className={`p-2 rounded ${playSound === 'y' ? 'bg-green-500' : 'bg-blue-500'} text-white`}
              onClick={handlePlaySound}
            >
              Play Sound
            </button>
            <button
              className={`p-2 rounded ${playClaps === 'y' ? 'bg-green-500' : 'bg-blue-500'} text-white`}
              onClick={handlePlayClaps}
            >
              Play Claps
            </button>
            <button
              className={`p-2 rounded ${lock === 'y' ? 'bg-green-500' : 'bg-blue-500'} text-white`}
              onClick={handleLock}
            >
              Lock
            </button>
            <button
              className={`p-2 rounded ${results === 'y' ? 'bg-green-500' : 'bg-blue-500'} text-white`}
              onClick={handleResults}
            >
              Results
            </button>
            <button
              className={`p-2 rounded ${options === 'y' ? 'bg-green-500' : 'bg-blue-500'} text-white`}
              onClick={handleOptions}
            >
              Options
            </button>
            <button
              className="bg-purple-500 text-white p-2 rounded"
              onClick={handleNext}
            >
              Next
            </button>
          </div>

          {/* Show result */}
          {showResult && (
            <div className="mt-4 text-lg font-bold">
              {showResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameConsole;
