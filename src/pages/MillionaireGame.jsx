import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import Lifelines from './lifelines';

const ReadQuestionData = () => {
  const [questionData, setQuestionData] = useState(null);
  const db1 = getDatabase(); // Assuming you've initialized Firebase already

  useEffect(() => {
    // Define the path to "askedQuestions" in RTDB
    const basePath = '/'; // Replace with your actual path
    const path = `${basePath}/askedQuestions/q`;
    const databaseRef = ref(db1, path);

    // Listen for changes at the defined path
    const unsubscribe = onValue(databaseRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Fetched data:', data.buttonStates.lock);
        setQuestionData(data); // Update state with fetched data
      } else {
        console.log('No data available');
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [db1]);

  return (
    <div>
      <h1>Question Data</h1>
      <Lifelines questionData={questionData} /> {/* Pass questionData as a prop */}
      {questionData ? (
        <pre>{JSON.stringify(questionData, null, 2)}</pre>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default ReadQuestionData;
