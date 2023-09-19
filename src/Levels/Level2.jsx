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
import data from './Level2Data.json'
import { MathUtils } from 'three';
import EndZone from '../Components/EndZone';
import StartZone from '../Components/StartZone';
import useGame from '../Stores/useGame';






export default function Level2({playerEnable,level,name}) {

  const [highScores, setHighScores] = useState([]);
  const group = useRef();
  const speed = 2; // Generate a random speed between 0.5 and 2
  const restart = useGame(state => state.restart);
  level = 2

  useEffect(() => {
    axios.get('https://1q3u4ig7bg.execute-api.eu-north-1.amazonaws.com/prod/highscores')
      .then(response => {
        const filteredScores = response.data.filter(score => score.level === level || score.level === '2');
        setHighScores(filteredScores);
      })
      .catch(error => {
        console.error('Error fetching high scores:', error);
      });
  }, [level,restart]);
  


  useContactMaterial('ground', 'slippery', {
    friction: 0,
    restitution: 0.1,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3
  })


  

  return (
    <>

        <StartZone args={[5,0.2,5]} position={[1,0,0]} material={'ground'} checkerPosition ={[1,0.2,-2]}/>
        <EndZone args={[5,0.2,5]} position={[-15.239883422851562,20.5,-6.5]} material={'ground'} checkerPosition ={[-13.5,20.65,-6.5]} level={level} name={name}/>
        <Obstacles material={'ground'} data={data} speed={speed}/>
        <MovingPlatforms material={'ground'} data={data}/>
        <Platforms material={'ground'} playerRef={group} data={data}/>
        <JumpPads material={'ground'} data={data}/>
        {playerEnable?<Leaderboard highScores={highScores} /> :''}

    </>
  )
}
