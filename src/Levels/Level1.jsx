import {useContactMaterial } from '@react-three/cannon'
import { useState, useRef,useEffect} from 'react'
import JumpPads from '../Components/JumpPads';
import MovingPlatforms from '../Components/MovingPlatforms';
import Obstacles from '../Components/Obstacles';
import PlatformLarge from '../Components/PlatformLarge';
import Platforms from '../Components/Platforms';
import Checker from '../Components/Checker';
import axios from 'axios';
import Leaderboard from '../Components/Leaderboard';
import data from './Level1Data.json'
import useGame from '../Stores/useGame';
import Pepostars from '../Components/Pepostars';
import SpaceShip from '../Components/Spaceship';
import Breakables from '../Components/Breakables';
import StartZone from '../Components/StartZone';
import EndZone from '../Components/EndZone';
import {Text,Float} from '@react-three/drei'





export default function Level1({playerEnable,level,name}) {

  const [highScores, setHighScores] = useState([]);
  const group = useRef();
  const PepostarsRef = useRef();
  const [resetKey, setResetKey] = useState(0);
  const restart = useGame(state => state.restart);
  const playerPosition = useGame(state => state.playerPosition);


  


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


        {playerEnable?<SpaceShip/>:''}
        <Pepostars data={data} ref={PepostarsRef} />
        <StartZone args={[5,0.2,5]} position={[1,0,0]} material={'ground'} checkerPosition ={[1,0.2,-2]}/>
        <Float speed={2.5} position={[4,2,-2]}> 
              <Text fontSize={0.5}  color={'gold'}>R to Restart!</Text>
        </Float>
        <Platforms material={'ground'} playerRef={group} data={data}/>
        <PlatformLarge args={[5,0.2,5]} position={[48,6,-4]} material={'ground'}/>
        <EndZone args={[5,0.2,5]} position={[48,6,-4]} material={'ground'} checkerPosition ={[46.3,6.15,-4]} level={level} name={name}/>
        <Obstacles material={'ground'} data={data}/>
        <MovingPlatforms material={'ground'} data={data}/>
        <Breakables key={resetKey}material={'ground'}  data={data}/>
        <JumpPads material={'ground'} data={data}/>
        {playerEnable?<Leaderboard highScores={highScores} /> :''}

    </>
  )
}
