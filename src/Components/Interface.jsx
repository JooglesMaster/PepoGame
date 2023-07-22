// Interface.jsx
import React from 'react';
import useGame from '../Stores/useGame';
import '../CSS/Media.css';

const Interface = () => {
  const elapsedTime = useGame((state) => state.elapsedTime);
  const timerRunning = useGame((state) => state.timerRunning);

  if (!timerRunning && elapsedTime === 0) {
    return null;
  }

  return (
    <div className='interface'>
      {/* Time */}
      <div className="time">
        {timerRunning ? elapsedTime.toFixed(2) : `You've won!: ${elapsedTime.toFixed(2)}`}
      </div>
    </div>
  );
};

export default Interface;