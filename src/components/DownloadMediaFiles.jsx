import { useState, useEffect } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { openDB } from 'idb';
import { saveAs } from 'file-saver'; // File saving utility
import { storage } from '../firebase'; // Ensure `storage` is correctly imported from Firebase setup

const dbName = 'QuestionDB';
const storeName = 'questionsStore';
const getDB = async () => {
  return openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'ID', autoIncrement: true });
        console.log(`Object store '${storeName}' created.`);
      }
    },
  });
};


const pageSize = 5; // Pagination size for displaying data

const DownloadMediaFiles = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Load data from IndexedDB on mount
  useEffect(() => {
    loadQuestionsFromIndexedDb();
  }, []);

  // Load question data from IndexedDB
  const loadQuestionsFromIndexedDb = async () => {
    try {
      const db = await getDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const allData = await store.getAll();
      
      console.log('all data', allData);
  
      // Filter records with 'sele' as 'y' and valid 'media link'
      const filteredData = allData.filter(
        (record) => record.sele === 'y' && record['media link'] !== '' && record['media link'] !== 'a'
      );
  
      setData(filteredData);
      setTotalPages(Math.ceil(filteredData.length / pageSize));
    } catch (error) {
      console.error('Error loading data from IndexedDB:', error);
    }
  };
  

  // Download a single file
  const downloadFile = async (mediaLink) => {
    try {
      const storageRef = ref(storage, mediaLink);
      const downloadURL = await getDownloadURL(storageRef);

      const fileName = mediaLink.split('/').pop(); // Extract file name from URL
      const fileResponse = await fetch(downloadURL);
      const blob = await fileResponse.blob();
      
      // Save file to user-selected location (browser will ask for download location)
      saveAs(blob, fileName);
      console.log('Downloading file:', fileName);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Pagination functions
  const paginatedData = () => {
    const start = currentPage * pageSize;
    return data.slice(start, start + pageSize);
  };

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
      <h1 className="text-2xl font-bold mb-4">Download Media Files</h1>

      {/* Data Display */}
      {data.length > 0 ? (
        <div className="space-y-6">
          {paginatedData().map((record, index) => (
            <div key={record.ID} className="p-4 bg-white shadow rounded-md">
              <h3 className="text-lg font-semibold">Question {index + 1 + currentPage * pageSize}</h3>
              <p>Question: {record.question}</p>
              <p>Media Link: {record['media link']}</p>

              {/* Download file button for each file */}
              <button
                onClick={() => downloadFile(record['media link'])}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Download File
              </button>
            </div>
          ))}

          {/* Pagination controls */}
          <div className="flex justify-between mt-4">
            <button
              onClick={goToPrevPage}
              className="bg-gray-500 text-white px-4 py-2 rounded"
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span className="text-lg">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              className="bg-gray-500 text-white px-4 py-2 rounded"
              disabled={currentPage === totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No media files to download.</p>
      )}
    </div>
  );
};

export default DownloadMediaFiles;
