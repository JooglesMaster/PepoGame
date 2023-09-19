import { useState } from 'react';

const useHighScoreSubmit = () => {
  const sendHighScore = async (highScore) => {
    try {
      const response = await fetch('https://1q3u4ig7bg.execute-api.eu-north-1.amazonaws.com/prod/highscores', {
        method: 'POST',
        headers: {
          'origin': 'http://localhost:3000/',
          // Include additional headers if necessary
        },
        body: JSON.stringify(highScore),
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
      } else {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [sendHighScore]; // We're returning an array here.
};

export default useHighScoreSubmit;
