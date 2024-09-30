import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, doc, setDoc, arrayUnion, updateDoc  } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure you import `db` from your Firebase setup

const AddDataFromJSON = () => {
  const { userData } = useAuth(); // Fetch user data to ensure admin role
  const [jsonData, setJsonData] = useState([]);
  const [file, setFile] = useState(null);

  // Handle file upload
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setJsonData(Array.isArray(data) ? data : [data]); // Ensure data is array
        } catch (error) {
          alert('Error parsing JSON file');
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  // Handle save data to Firestore
  const handleSave = async () => {
    if (jsonData.length === 0) {
      alert('No data to save');
      return;
    }
  
    try {
      const docRef = doc(collection(db, 'questionSets'), 'quiz'); // Reference the specific document you want to update
  
      // Update the document by appending new questions using arrayUnion
      await updateDoc(docRef, {
        questions: arrayUnion(...jsonData), // Spread the jsonData array to add each element separately
      });
  
      alert('Data successfully added to the existing document!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Add Data from JSON</h1>
      
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="mb-4"
      />
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Set No</th>
              <th className="border px-4 py-2">Q No</th>
              <th className="border px-4 py-2">Question</th>
              <th className="border px-4 py-2">Options</th>
              <th className="border px-4 py-2">Answer</th>
              <th className="border px-4 py-2">Lifeline</th>
              <th className="border px-4 py-2">Hint</th>
              <th className="border px-4 py-2">Priority</th>
            </tr>
          </thead>
          <tbody>
            {jsonData.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{item.qset}</td>
                <td className="border px-4 py-2">{item.qno}</td>
                <td className="border px-4 py-2">{item.question}</td>
                <td className="border px-4 py-2">
                  <ul>
                    <li>A: {item.A}</li>
                    <li>B: {item.B}</li>
                    <li>C: {item.C}</li>
                    <li>D: {item.D}</li>
                  </ul>
                </td>
                <td className="border px-4 py-2">{item.true_ans.toUpperCase()}</td>
                <td className="border px-4 py-2">{item.L5050}</td>
                <td className="border px-4 py-2">{item.Hint}</td>
                <td className="border px-4 py-2">{item.Priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        Save Data
      </button>
    </div>
  );
};

export default AddDataFromJSON;
