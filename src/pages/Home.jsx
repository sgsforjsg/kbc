// Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
      <h2>Navigate to Pages</h2>
      <Link to="/admin">
        <button>Go to Admin Page</button>
      </Link>
      <Link to="/game">
        <button>Go to Game Setup</button>
      </Link>
      <Link to="/game-console">
        <button>Go to Game Console</button>
      </Link>
      <Link to="/add-data">
        <button>Add Data from JSON</button>
      </Link>
      <Link to="/edit">
        <button>Edit database</button>
      </Link>



      <Link to="/manageq">
        <button>Manage Questions</button>
      </Link>
      <Link to="/game2">
        <button>Millionaire Game</button>
      </Link>
    </div>
  );
};

export default Home;
