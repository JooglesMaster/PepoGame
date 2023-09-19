// Interface.jsx
import React from 'react';
import useGame from '../Stores/useGame';
import '../CSS/Media.css';

const Interface = () => {
  const elapsedTime = useGame((state) => state.elapsedTime);
  const timerRunning = useGame((state) => state.timerRunning);
  const pepostarsCollected = useGame((state) => state.pepostarsCollected);

  if (!timerRunning && elapsedTime === 0) {
    return null;
  }

  return (
    <div className='interface'>
        <div className="time">
            {timerRunning ? elapsedTime.toFixed(2) : `You've won!: ${elapsedTime.toFixed(2)}`}
        </div>
        <div className="pepostars"> 
            {pepostarsCollected === 0 ? '' : {pepostarsCollected}/3 }
        </div>
    </div>
  );
};

export default Interface;