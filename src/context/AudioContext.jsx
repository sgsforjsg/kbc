export const stopAllAudio = () => {
    if (typeof AudioContext !== 'undefined') {
      const audioCtx = new AudioContext();
      audioCtx.close(); // Closes all audio streams immediately
    } else if (typeof webkitAudioContext !== 'undefined') {
      const audioCtx = new webkitAudioContext();
      audioCtx.close();
    }
  };
  