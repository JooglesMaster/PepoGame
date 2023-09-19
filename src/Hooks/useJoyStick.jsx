import { useState, useEffect } from 'react';
import { Joystick } from 'react-joystick-component';

export const useJoyStick = () => {
  const [joystickData, setJoystickData] = useState({ x: 0, y: 0 });

  const handleMove = (event) => {
    setJoystickData({ x: event.x, y: event.y });
  };



  const handleStop = () => {
    setJoystickData({ x: 0, y: 0 });
  };

  const renderJoystick = () => (
    <div className="joystick-container">
      <Joystick
        size={200}
        baseColor="red"
        stickColor="blue"
        move={handleMove}
        stop={handleStop}
        disabled={false}

      />
    </div>

  );

  return { joystickData, renderJoystick };
};