import { useRef, useState } from 'react';
import '../CSS/Media.css';

const LevelSelect = ({ setLevel, playerEnable }) => {
    const levelList = [1, 2, 3];
    const [selectedLevel, setSelectedLevel] = useState(1);

    const levels = levelList.map((level) => {

      return (
          <div 
              key={level} 
              className={`level-container ${selectedLevel === level ? 'selected' : ''}`} 
              onClick={() => {
                  setLevel(level); 
                  setSelectedLevel(level);
              }}>
              <div className="level-content">
                  <h1>Level {level}</h1>
              </div>
          </div>
      );
  });
  

    return !playerEnable ? <div className="levels-wrapper">{levels}</div> : null;
};

export default LevelSelect;
