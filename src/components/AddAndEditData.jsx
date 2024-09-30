import { useState, useEffect } from 'react';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase'; // Ensure you import `db` and `storage` from Firebase setup
import { openDB } from 'idb'; // IndexedDB using idb library (run `npm install idb`)

const dbName = 'QuestionDB';
const storeName = 'questionsStore';
const pageSize = 5; // Number of records per page

const AddAndEditData = () => {
  const [data, setData] = useState([]);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [file, setFile] = useState(null);
  const [indexedDbExists, setIndexedDbExists] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Track the current page
  const [totalPages, setTotalPages] = useState(0); // Track total number of pages

  // Check if IndexedDB contains data on mount
  useEffect(() => {
    checkIndexedDb();
  }, []);

  // IndexedDB setup and check
  const checkIndexedDb = async () => {
    const db = await openDB(dbName, 1, {
      upgrade(db) {
        db.createObjectStore(storeName, { keyPath: 'ID' });
      },
    });

    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const count = await store.count();
    setIndexedDbExists(count > 0);
  };

  // Load data from Firestore if IndexedDB is empty
  const loadDataFromFirestore = async () => {
    const docRef = doc(collection(db, 'questionSets'), 'yourDocumentID');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const questionsData = docSnap.data().questions;
      setData(questionsData);
      saveToIndexedDb(questionsData);
      setTotalPages(Math.ceil(questionsData.length / pageSize)); // Set total pages based on data
    }
  };

  // Save to IndexedDB
  const saveToIndexedDb = async (questions) => {
    const db = await openDB(dbName, 1);
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    questions.forEach((item) => store.put(item));
    await tx.done;
    setIndexedDbExists(true);
    alert('Data stored in IndexedDB');
  };

  // Read data from IndexedDB
  const readFromIndexedDb = async () => {
    const db = await openDB(dbName, 1);
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const allData = await store.getAll();
    setData(allData);
    setTotalPages(Math.ceil(allData.length / pageSize)); // Set total pages based on data
  };

  // Update record in IndexedDB
  const updateIndexedDbRecord = async (record) => {
    const db = await openDB(dbName, 1);
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.put(record);
    alert('Record updated in IndexedDB');
  };

  // Update Firestore with IndexedDB data
  const updateFirestoreWithIndexedDb = async () => {
    const docRef = doc(collection(db, 'questionSets'), 'yourDocumentID');
    await updateDoc(docRef, { questions: data });
    alert('Data updated in Firestore from IndexedDB');
  };

  // Handle file input for media link upload
  const handleFileInput = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file to Firebase Storage and update media link
  const uploadFile = async (record) => {
    if (!file) {
      alert('Please select a file');
      return;
    }
  
    try {
      // Show message: uploading started
      alert('Uploading file, please wait...');

      const storageRef = ref(storage, `media/${file.name}`);
      await uploadBytes(storageRef, file);
      
      // Get the file URL after upload
      const fileURL = await getDownloadURL(storageRef);
  
      // Update the media link field
      const updatedRecord = { ...record, 'media link': fileURL };
      await updateIndexedDbRecord(updatedRecord);
  
      // Show message: upload successful
      alert('File uploaded successfully, media link updated!');
    } catch (error) {
      // Show message: upload error
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  // Handle record field edits
  const handleEdit = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
    setCurrentRecord(updatedData[index]);
  };

  // Get paginated data
  const paginatedData = () => {
    const start = currentPage * pageSize;
    return data.slice(start, start + pageSize);
  };

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Add and Edit Data</h1>

      {/* Check if IndexedDB exists and allow refreshing */}
      {indexedDbExists ? (
        <div className="flex space-x-4 mb-4">
          <button onClick={readFromIndexedDb} className="bg-blue-500 text-white px-4 py-2 rounded">
            Use Current Data
          </button>
          <button onClick={loadDataFromFirestore} className="bg-blue-500 text-white px-4 py-2 rounded">
            Refresh Data
          </button>
        </div>
      ) : (
        <button onClick={loadDataFromFirestore} className="bg-blue-500 text-white px-4 py-2 rounded">
          Load Data from Firestore
        </button>
      )}

      {/* Pagination and editing */}
      {data.length > 0 && (
        <div className="space-y-6">
          {paginatedData().map((record, index) => (
            <div key={record.ID} className="p-4 bg-white shadow rounded-md">
              <h3 className="text-lg font-semibold">Question {index + 1 + currentPage * pageSize}</h3>
              <div className="mt-2 space-y-2">
                <label className="block">
                  <span>Question:</span>
                  <input
                    type="text"
                    value={record.question}
                    onChange={(e) => handleEdit(index + currentPage * pageSize, 'question', e.target.value)}
                    className="block w-full mt-1 p-2 border border-gray-300 rounded"
                  />
                </label>
                <label className="block">
                  <span>Answer:</span>
                  <input
                    type="text"
                    value={record.true_ans}
                    onChange={(e) => handleEdit(index + currentPage * pageSize, 'true_ans', e.target.value)}
                    className="block w-full mt-1 p-2 border border-gray-300 rounded"
                  />
                </label>
                <label className="block">
                  <span>Priority:</span>
                  <input
                    type="text"
                    value={record.Priority}
                    onChange={(e) => handleEdit(index + currentPage * pageSize, 'Priority', e.target.value)}
                    className="block w-full mt-1 p-2 border border-gray-300 rounded"
                  />
                </label>
                <label className="block">
                  <span>Media Link:</span>
                  <input
                    type="text"
                    value={record['media link']}
                    className="block w-full mt-1 p-2 border border-gray-300 rounded"
                    disabled
                  />
                </label>
                <div className="flex items-center space-x-2 mt-2">
                  <button onClick={() => uploadFile(record)} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Edit Media Link
                  </button>
                  <input type="file" onChange={handleFileInput} className="block w-full mt-1 p-2 border border-gray-300 rounded" />
                </div>
              </div>
            </div>
          ))}

          {/* Pagination controls */}
          <div className="flex justify-between mt-4">
            <button onClick={goToPrevPage} className="bg-gray-500 text-white px-4 py-2 rounded" disabled={currentPage === 0}>
              Previous
            </button>
            <span className="text-lg">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button onClick={goToNextPage} className="bg-gray-500 text-white px-4 py-2 rounded" disabled={currentPage === totalPages - 1}>
              Next
            </button>
          </div>

          <button onClick={updateFirestoreWithIndexedDb} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
            Update Firestore with IndexedDB
          </button>
        </div>
      )}
    </div>
  );
};

export default AddAndEditData;
