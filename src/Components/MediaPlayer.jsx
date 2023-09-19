import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { FaPlay, FaPause, FaForward, FaBackward, FaCompress, FaExpand } from 'react-icons/fa';
import { SlReload } from "react-icons/sl";
import '../CSS/Media.css';
import useGame from "../Stores/useGame";


function Media_Player() {
  const [playing, setPlaying] = useState(false);
  const [minimized, setMinimized] = useState(true); 
  const [volume, setVolume] = useState(0.8); 
  const restart = useGame(state => state.restart);
  const setRestart = useGame(state => state.setRestart);



  const playlist = [
    {
      url: 'https://www.youtube.com/watch?v=MnFSMwOhlFg&ab_channel=Liquicity',
      title: 'Dreamcatcher (Dualistic Remix)',
    },
    {
      url: 'https://www.youtube.com/watch?v=tEcggRukZCs&ab_channel=Liquicity',
      title: 'Ghost Assassin',
    },
    {
      url: 'https://www.youtube.com/watch?v=uO7kCUjUaUE&ab_channel=SuicideSheeep',
      title: 'Leave the Lights On',
    },
    {
      url: 'https://www.youtube.com/watch?v=HdeYwObD-j4&ab_channel=DaftPunk',
      title: 'Robot Rock',
    },
    {
      url: 'https://www.youtube.com/watch?v=mNjmGuJY5OE&ab_channel=LondonRecords',
      title: 'Halcyon And On And On',
    },
    {
      url: 'https://www.youtube.com/watch?v=MnFSMwOhlFg&ab_channel=Liquicity',
      title: 'Dreamcatcher (Dualistic Remix)',
    },
    {
      url: 'https://www.youtube.com/watch?v=CPK2HwYzjkA&ab_channel=bonnietylerVEVO',
      title: 'Holding out for a Hero',
    },
    {
      url: 'https://www.youtube.com/watch?v=wDSrUiVPpdM&ab_channel=T%26Sugah-Topic',
      title: 'I Ran ',
    },
  ];
  const [videoIndex, setVideoIndex] = useState(Math.floor(Math.random() * playlist.length));

  const handleClick = () => {
    setPlaying(!playing);
  };

  const handleNext = () => {
    setVideoIndex((videoIndex + 1) % playlist.length); 
  };

  const handleBack = () => {
    setVideoIndex((videoIndex - 1 + playlist.length) % playlist.length); 
  };

  const handleRefresh = () => {
    setRestart(true);
    console.log(restart);
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
          <button className="player-btn" onClick={handleRefresh}>
            {minimized ? <SlReload /> : <SlReload />}
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
        onEnded={handleNext} 
        volume={volume}
      />
    </>
  );
}

export default Media_Player;
