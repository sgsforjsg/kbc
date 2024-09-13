import { useEffect, useState } from 'react';
import { collection, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import the Firestore setup

const ManageQuestions = () => {
  const [questionsData, setQuestionsData] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editQuestion, setEditQuestion] = useState(null);

  // Fetch the questions from Firebase
  const fetchQuestions = async () => {
    try {
      const docRef = doc(collection(db, 'questionSets'), 'iISsquxiWPuH4jHIBTk5'); // Use the correct document ID
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setQuestionsData(docSnap.data().questions);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle editing a question
  const handleEdit = (question) => {
    setEditQuestion(question);
  };

  // Handle saving updated question to Firestore
  const handleSave = async () => {
    if (!editQuestion) return;

    try {
      // Find the updated question and replace it in the array
      const updatedQuestions = questionsData.map((q) =>
        q.qNo === editQuestion.qNo ? editQuestion : q
      );

      // Update the document in Firestore
      const docRef = doc(collection(db, 'questionSets'), 'iISsquxiWPuH4jHIBTk5'); // Use the correct document ID
      await updateDoc(docRef, { questions: updatedQuestions });
      
      setQuestionsData(updatedQuestions);
      alert('Question updated successfully!');
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Failed to update question.');
    }

    setEditQuestion(null); // Reset edit state
  };

  // Handle selecting a question to add to `askedQuestions` collection
  const handleSelect = async (question) => {
    try {
      // Convert qNo to string (or use another unique identifier like a random ID)
      const docRef = doc(collection(db, 'askedQuestions'), String(question.qNo)); 
  
      // Save the selected question to Firestore
      await setDoc(docRef, question);
  
      alert('Question added to askedQuestions!');
    } catch (error) {
      console.error('Error adding question to askedQuestions:', error);
      alert('Failed to add question.');
    }
  };
  

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manage Questions</h1>

      {/* Display questions */}
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Set No</th>
              <th className="border px-4 py-2">Q No</th>
              <th className="border px-4 py-2">Question</th>
              <th className="border px-4 py-2">Options</th>
              <th className="border px-4 py-2">Answer</th>
              <th className="border px-4 py-2">Lifecode</th>
              <th className="border px-4 py-2">Level</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questionsData.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{item.setNo}</td>
                <td className="border px-4 py-2">{item.qNo}</td>
                <td className="border px-4 py-2">{item.question}</td>
                <td className="border px-4 py-2">
                  <ul>
                    {item.options.map((option, idx) => (
                      <li key={idx}>{option}</li>
                    ))}
                  </ul>
                </td>
                <td className="border px-4 py-2">{item.ans}</td>
                <td className="border px-4 py-2">{item.lifecode}</td>
                <td className="border px-4 py-2">{item.level}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-green-500 text-white p-2 rounded mr-2"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-blue-500 text-white p-2 rounded"
                    onClick={() => handleSelect(item)}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Question Modal */}
      {editQuestion && (
        <div className="p-4 border border-gray-400 bg-gray-100 rounded mt-4">
          <h2 className="text-lg font-bold mb-4">Edit Question {editQuestion.qNo}</h2>

          <label className="block mb-2">Question:</label>
          <input
            type="text"
            className="border p-2 w-full mb-4"
            value={editQuestion.question}
            onChange={(e) =>
              setEditQuestion({ ...editQuestion, question: e.target.value })
            }
          />

          <label className="block mb-2">Answer:</label>
          <input
            type="text"
            className="border p-2 w-full mb-4"
            value={editQuestion.ans}
            onChange={(e) =>
              setEditQuestion({ ...editQuestion, ans: e.target.value })
            }
          />

          <label className="block mb-2">Level:</label>
          <input
            type="text"
            className="border p-2 w-full mb-4"
            value={editQuestion.level}
            onChange={(e) =>
              setEditQuestion({ ...editQuestion, level: e.target.value })
            }
          />

          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;
