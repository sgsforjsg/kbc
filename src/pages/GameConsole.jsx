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

  // Fetch all question sets from Firestore
  const fetchQuestionSets = async () => {
    try {
      const docRef = doc(collection(db, 'questionSets'), 'iISsquxiWPuH4jHIBTk5'); // Use correct document ID
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setQuestionSets(docSnap.data().questions);
        console.log('data',docSnap)
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

      {/* Show question sets */}
      <div className="mb-4">
        <h2 className="text-lg font-bold">Available Question Sets</h2>
        <div className="flex">
          {questionSets.map((set) => (
           
            <button
              key={set.setNo}
              className="bg-gray-300 p-2 rounded m-2"
              onClick={() => handleSetSelect(set.setNo)}
            > {console.log(set)}
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

          {/* Action buttons */}
          <div className="flex space-x-4">
            <button className="bg-green-500 text-white p-2 rounded" onClick={handlePost}>
              Post
            </button>
            <button className="bg-yellow-500 text-white p-2 rounded" onClick={handleLock}>
              Lock
            </button>
            <button className="bg-blue-500 text-white p-2 rounded" onClick={handleShow}>
              Show
            </button>
            <button className="bg-purple-500 text-white p-2 rounded" onClick={handleNext}>
              Next
            </button>
          </div>

          {/* Show result */}
          {showResult && (
            <div className={`mt-4 p-2 ${showResult === 'Correct!' ? 'bg-green-200' : 'bg-red-200'} rounded`}>
              {showResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameConsole;
