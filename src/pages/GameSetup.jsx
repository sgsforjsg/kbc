import { useState, useEffect } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore setup
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const GameSetup = () => {
  const [questionSets, setQuestionSets] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [setNo, setSetNo] = useState('');
  const [questionNo, setQuestionNo] = useState(0);
  const navigate = useNavigate();

  // Fetch question sets from Firestore
  const fetchQuestionSets = async () => {
    try {
      const docRef = doc(collection(db, 'questionSets'), 'quiz'); // Use correct document ID
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

  const handleStart = () => {
    if (setNo && questionNo >= 0) {
      // Filter the questions based on setNo and qNo >= entered questionNo
      const filtered = questionSets.filter(
        (q) => q.qset === Number(setNo) && q.qno >= Number(questionNo)
      );
      setFilteredQuestions(filtered);

      // Navigate to the GameConsole route with filtered questions
      if (filtered.length > 0) {
        console.log('filtered set',filtered);
        navigate('/game-console', { state: { setNo, filteredQuestions: filtered } });
      } else {
        alert('No questions found for the entered Set No and Question No');
      }
    } else {
      alert('Please enter valid Set No and Question No');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Game Setup</h1>
      <div className="mb-4 grid grid-cols-6 gap-4">
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
      </div>
      <button className="bg-green-500 text-white p-2 rounded" onClick={handleStart}>
        Start Game
      </button>
    </div>
  );
};

export default GameSetup;
