import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { FaPlay, FaPause, FaForward, FaBackward, FaCompress, FaExpand } from 'react-icons/fa';
import '../CSS/Media.css';

function Media_Player() {
  const [playing, setPlaying] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [minimized, setMinimized] = useState(true);  // New state for minimizing the player
  const [volume, setVolume] = useState(0.8); // start at 80% volume


  const playlist = [
    {
      url: 'https://www.youtube.com/watch?v=xX2TZZPISng',
      title: 'Love Story Hardstyle',
    },
    {
      url: 'https://www.youtube.com/watch?v=E58mudmdVt0&list=PLwdgADfukuHhYsjGqlmUuI_8xjpFbQzae&index=14&ab_channel=Pleyya',
      title: 'Sweet But Psycho Hardstyle',
    },
    // more videos...
  ];

  const handleClick = () => {
    setPlaying(!playing);
  };

  const handleNext = () => {
    setVideoIndex((videoIndex + 1) % playlist.length); // go to next video or loop back to start
  };

  const handleBack = () => {
    setVideoIndex((videoIndex - 1 + playlist.length) % playlist.length); // go to previous video or loop back to end
  };

  const playerClass = minimized ? 'player minimized' : 'player';
  return (
    <>
      <div className={playerClass}>
        {!minimized && <h2 className="player-title">{playlist[videoIndex].title}</h2>}
        <div className="player-controls">
          {!minimized && <button className="player-btn" onClick={handleBack}>
            <FaBackward />
          </button>}
          <button className="player-btn" onClick={handleClick}>
            {playing ? <FaPause /> : <FaPlay />}
          </button>
          {!minimized && <button className="player-btn" onClick={handleNext}>
            <FaForward /> 
          </button>}
          <button className="player-btn" onClick={() => setMinimized(!minimized)}>
            {minimized ? <FaExpand /> : <FaCompress />}
          </button>
        </div>
        {!minimized && (
        <div className="volume-control">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
          />
        </div>
        )}
      </div>
      <ReactPlayer
        url={playlist[videoIndex].url}
        playing={playing}
        width='0'
        height='0'
        onEnded={handleNext} // Go to next video when current one ends
        volume={volume}
      />
    </>
  );
}

export default Media_Player;
