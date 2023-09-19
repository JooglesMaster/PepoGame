import {useContactMaterial } from '@react-three/cannon'
import { useState, useRef,useEffect} from 'react'
import { Float,Text} from '@react-three/drei'
import JumpPads from '../Components/JumpPads';
import MovingPlatforms from '../Components/MovingPlatforms';
import Obstacles from '../Components/Obstacles';
import PlatformLarge from '../Components/PlatformLarge';
import Platforms from '../Components/Platforms';
import Checker from '../Components/Checker';
import axios from 'axios';
import Leaderboard from '../Components/Leaderboard';
import data from './Level3Data.json'
import Breakables from '../Components/Breakables';
import useGame from '../Stores/useGame';
import Guns from '../Components/Guns';
import Pepostars from '../Components/Pepostars';
import { MathUtils } from 'three';
import StartZone from '../Components/StartZone';
import EndZone from '../Components/EndZone';






export default function Level2({playerEnable,level,name}) {

  const [highScores, setHighScores] = useState([]);
  const group = useRef();
  const restart = useGame(state => state.restart);
  const [resetKey, setResetKey] = useState(0);
  const speed = 4; // Generate a random speed between 0.5 and 2
  const PepostarsRef = useRef();

  useEffect(() => {
    axios.get('https://1q3u4ig7bg.execute-api.eu-north-1.amazonaws.com/prod/highscores')
      .then(response => {
        const filteredScores = response.data.filter(score => score.level === level);
        setHighScores(filteredScores);
      })
      .catch(error => {
        console.error('Error fetching high scores:', error);
      });
  }, [level,restart]);

  useEffect(() => {
    if (restart) {
      setResetKey(prevKey => prevKey + 1);  // Increment the key to force re-render
    }
  }, [restart]);


  useContactMaterial('ground', 'slippery', {
    friction: 0,
    restitution: 0.1,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3
  })


  

  return (
    <>

        <StartZone args={[5,0.2,5]} position={[1,0,0]} material={'ground'} checkerPosition ={[1,0.2,-2]}/>
        <EndZone args={[5,0.2,5]} position={[-28.5,13,-6]} material={'ground'} checkerPosition ={[-26.8,13.11,-6]} level={level} name={name}/>
        <MovingPlatforms material={'ground'} data={data}/>
        <Platforms material={'ground'} playerRef={group} data={data}/>
        <Breakables key={resetKey} material={'ground'} data={data}/>
        <Obstacles  material={'ground'} data={data} speed={speed}/>
        {/* <Pepostars data={data} ref={PepostarsRef} /> */}
        <JumpPads material={'ground'} data={data}/>
        <Guns material={'ground'} data={data}/>
        {playerEnable?<Leaderboard highScores={highScores} reset /> :''}

    </>
  )
}
