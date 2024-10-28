import { createContext, useContext, useState } from 'react';

const MediaContext = createContext();

export const useMedia = () => useContext(MediaContext);

export const MediaProvider = ({ children }) => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [localMediaLink, setLocalMediaLink] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <MediaContext.Provider
      value={{ mediaFiles, setMediaFiles, localMediaLink, setLocalMediaLink, isPlaying, setIsPlaying }}
    >
      {children}
    </MediaContext.Provider>
  );
};
