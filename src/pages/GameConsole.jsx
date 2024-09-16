import { useState, useEffect } from 'react';
import { collection, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore setup

const GameConsole = () => {
  const [questionSets, setQuestionSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  // State for editable fields
  const [setNo, setSetNo] = useState('');
  const [questionNo, setQuestionNo] = useState(0);
  const [displayLifeLogos, setDisplayLifeLogos] = useState(false);
  const [life1, setLife1] = useState(false);
  const [life2, setLife2] = useState(false);
  const [life3, setLife3] = useState(false);
  const [displayQuestion, setDisplayQuestion] = useState(false);
  const [displayOptions, setDisplayOptions] = useState(false);

  // Fetch all question sets from Firestore
  const fetchQuestionSets = async () => {
    try {
      const docRef = doc(collection(db, 'questionSets'), 'iISsquxiWPuH4jHIBTk5'); // Use correct document ID
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setQuestionSets(docSnap.data().questions);
      } else {
        console.log('No question sets found');
      }
    } catch (error) {
      console.error('Error fetching question sets:', error);
    }
  };

  useEffect(() => {
    fetchQuestionSets();
  }, []);

  // Handle selecting a question set
  const handleSetSelect = (setNo) => {
    const set = questionSets.filter((q) => q.setNo === setNo);
    setSelectedSet(set);
    setCurrentQuestionIndex(0);
    setCurrentQuestion(set[0]);
  };

  // Handle selecting an answer for the current question
  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  // Handle posting the current question to `askedQuestions`
  const handlePost = async () => {
    if (!currentQuestion) return;

    try {
      const docRef = doc(collection(db, 'askedQuestions'), String(currentQuestion.qNo));
      await setDoc(docRef, currentQuestion);
      alert('Question posted to askedQuestions!');
    } catch (error) {
      console.error('Error posting question:', error);
    }
  };

  // Handle locking the answer (updating user answer)
  const handleLock = async () => {
    if (!selectedAnswer) return;
    try {
      const docRef = doc(collection(db, 'askedQuestions'), String(currentQuestion.qNo));
      await updateDoc(docRef, { userAnswer: selectedAnswer });
      alert('Answer locked!');
    } catch (error) {
      console.error('Error locking answer:', error);
    }
  };

  // Handle showing the result (comparing answers)
  const handleShow = () => {
    if (!selectedAnswer) return;
    const isCorrect = selectedAnswer === currentQuestion.ans;
    setShowResult(isCorrect ? 'Correct!' : 'Wrong Answer');
  };

  // Handle moving to the next question
  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < selectedSet.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(selectedSet[nextIndex]);
      setSelectedAnswer(null);
      setShowResult(null);
    } else {
      alert('No more questions in this set.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Game Console</h1>

      {/* Editable fields */}
      <div className="mb-4">
        <div className="grid grid-cols-6 gap-4 mb-4">
          <div className="flex flex-col items-start">
            <label className="text-sm font-semibold mb-1">Set No:</label>
            <input
              type="text"
              value={setNo}
              onChange={(e) => setSetNo(e.target.value)}
              placeholder="Enter Set No"
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="text-sm font-semibold mb-1">Question No:</label>
            <input
              type="number"
              value={questionNo}
              onChange={(e) => setQuestionNo(Number(e.target.value))}
              placeholder="Enter Question No"
              className="border p-2 rounded w-full"
              min="0"
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="text-sm font-semibold mb-1">Display Life Logos:</label>
            <input
              type="checkbox"
              checked={displayLifeLogos}
              onChange={(e) => setDisplayLifeLogos(e.target.checked)}
              className="mr-2"
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="text-sm font-semibold mb-1">Life 1:</label>
            <input
              type="checkbox"
              checked={life1}
              onChange={(e) => setLife1(e.target.checked)}
              disabled={!displayLifeLogos}
              className="mr-2"
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="text-sm font-semibold mb-1">Life 2:</label>
            <input
              type="checkbox"
              checked={life2}
              onChange={(e) => setLife2(e.target.checked)}
              disabled={!displayLifeLogos}
              className="mr-2"
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="text-sm font-semibold mb-1">Life 3:</label>
            <input
              type="checkbox"
              checked={life3}
              onChange={(e) => setLife3(e.target.checked)}
              disabled={!displayLifeLogos}
              className="mr-2"
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="text-sm font-semibold mb-1">Display Question:</label>
            <input
              type="checkbox"
              checked={displayQuestion}
              onChange={(e) => setDisplayQuestion(e.target.checked)}
              className="mr-2"
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="text-sm font-semibold mb-1">Display Options:</label>
            <input
              type="checkbox"
              checked={displayOptions}
              onChange={(e) => setDisplayOptions(e.target.checked)}
              className="mr-2"
            />
          </div>
        </div>
      </div>

      {/* Show question sets */}
      <div className="mb-4">
        <h2 className="text-lg font-bold">Available Question Sets</h2>
        <div className="flex flex-wrap">
          {questionSets.map((set) => (
            <button
              key={set.setNo}
              className="bg-gray-300 p-2 rounded m-2"
              onClick={() => handleSetSelect(set.setNo)}
            >
              Set {set.setNo}
            </button>
          ))}
        </div>
      </div>

      {/* Show selected question */}
      {currentQuestion && (
        <div className="p-4 bg-white border rounded">
          <h3 className="text-lg font-bold">Question {currentQuestion.qNo}</h3>
          <p>{currentQuestion.question}</p>

          {/* Show options as buttons */}
          {displayOptions && (
            <div className="my-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  className={`p-2 m-2 rounded ${selectedAnswer === option ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex space-x-4">
            <button
              className="bg-green-500 text-white p-2 rounded"
              onClick={handlePost}
              disabled={!displayQuestion}
            >
              Post
            </button>
            <button
              className="bg-yellow-500 text-white p-2 rounded"
              onClick={handleLock}
              disabled={!selectedAnswer || !displayQuestion}
            >
              Lock
            </button>
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={handleShow}
              disabled={!selectedAnswer || !displayQuestion}
            >
              Show
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
