import { useState, useEffect } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore setup
import GameConsole from './GameConsole'; // Import the Game Console component

const GameSetup = () => {
  const [questionSets, setQuestionSets] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [setNo, setSetNo] = useState('');
  const [questionNo, setQuestionNo] = useState(0);
  const [startGame, setStartGame] = useState(false);

  // Fetch question sets from Firestore
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

  const handleStart = () => {
    if (setNo && questionNo >= 0) {
      // Filter the questions based on setNo and qNo >= entered questionNo
      const filtered = questionSets.filter(
        (q) => q.setNo === Number(setNo) && q.qNo >= Number(questionNo)
      );
      setFilteredQuestions(filtered);

      // Start the game only if there are valid questions
      if (filtered.length > 0) {
        console.log(filtered)
        setStartGame(true);
      } else {
        alert('No questions found for the entered Set No and Question No');
      }
    } else {
      alert('Please enter valid Set No and Question No');
    }
  };

  // If the game has started, pass the filtered questions to the GameConsole component
  if (startGame) {
    return <GameConsole setNo={setNo} filteredQuestions={filteredQuestions} />;
  }

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
