import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Navigate to Pages</h2>
      <Link to="/admin" className="bg-blue-500 text-white px-4 py-2 rounded">
        Go to Admin Page
      </Link>
      <Link to="/game" className="bg-green-500 text-white px-4 py-2 rounded">
        Go to Game Setup
      </Link>
      <Link to="/game-console" className="bg-yellow-500 text-white px-4 py-2 rounded">
        Go to Game Console
      </Link>
      <Link to="/add-data" className="bg-purple-500 text-white px-4 py-2 rounded">
        Add Data from JSON
      </Link>
      <Link to="/edit" className="bg-pink-500 text-white px-4 py-2 rounded">
        Edit database
      </Link>
      <Link to="/dl_media" className="bg-teal-500 text-white px-4 py-2 rounded">
        Download All media Files
      </Link>
      <Link to="/manageq" className="bg-indigo-500 text-white px-4 py-2 rounded">
        Manage Questions
      </Link>
      <Link to="/game2" className="bg-blue-900 text-white px-4 py-2 rounded">
        Millionaire Game
      </Link>
    </div>
  );
};

export default Home;