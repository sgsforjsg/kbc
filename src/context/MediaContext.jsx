// MediaContext.js
import React, { createContext, useState, useContext } from 'react';

const MediaContext = createContext();

export const useMedia = () => useContext(MediaContext);

export const MediaProvider = ({ children }) => {
  const [mediaFiles, setMediaFiles] = useState([]);

  return (
    <MediaContext.Provider value={{ mediaFiles, setMediaFiles }}>
      {children}
    </MediaContext.Provider>
  );
};
