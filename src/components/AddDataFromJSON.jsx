import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, doc, setDoc } from 'firebase/firestore';
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
          setJsonData(data);
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
      const docRef = doc(collection(db, 'questionSets')); // Reference to a single document in `questionSets` collection
      await setDoc(docRef, { questions: jsonData }); // Save the entire JSON data in one document

      alert('Data successfully saved as a single document!');
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
              <th className="border px-4 py-2">Lifecode</th>
              <th className="border px-4 py-2">Level</th>
            </tr>
          </thead>
          <tbody>
            {jsonData.map((item, index) => (
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
