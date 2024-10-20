import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For routing to AddAndEditData
import { openDB } from 'idb'; // Import idb library


const DB_NAME = 'QuestionDB';
const STORE_NAME = 'questionsStore';


const GameSetup = () => {
  const [questionSets, setQuestionSets] = useState([]);
  const [setNo, setSetNo] = useState('1');
  const [questionNo, setQuestionNo] = useState(1);
  const navigate = useNavigate();

  // Initialize IndexedDB and return the database instance
  const initDB = async () => {
    return openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  };

  // Fetch question sets from IndexedDB
  const fetchQuestionSets = async () => {
    try {
      const db = await initDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const allQuestions = await store.getAll();

      if (allQuestions.length > 0) {
        setQuestionSets(allQuestions);
        console.log('Questions found:', allQuestions);
      } else {
        console.log('No questions found. Redirecting to AddAndEditData...');
        navigate('/edit'); // Navigate to AddAndEditData if no data found
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
      const filteredQuestions = questionSets.filter(
        (q) => q.qset === setNo && q.qno >= questionNo
      );

      if (filteredQuestions.length > 0) {
        navigate('/game-console', {
          state: { setNo, filteredQuestions },
        });
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
