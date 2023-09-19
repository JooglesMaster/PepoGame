import {useContactMaterial } from '@react-three/cannon'
import Player from '../Components/Player'
import { useState, useRef,useEffect} from 'react'
import {PerspectiveCamera} from '@react-three/drei'
import axios from 'axios'
import Level1 from '../Levels/Level1'
import Level2 from '../Levels/Level2'
import Level3 from '../Levels/Level3'


export default function Game({playerEnable, joystickData,jumpBox,name,level}) {



  const group = useRef();




  

  useContactMaterial('ground', 'slippery', {
    friction: 0,
    restitution: 0.1,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3
  })


  

  return (
    <>
          {level === 1 || level === 0 ? <Level1 playerEnable={playerEnable} level={level} name={name}/> : ''}
          {level === 2 ? <Level2 playerEnable={playerEnable} level={level} name={name}/> : ''}
          {level === 3 ? <Level3 playerEnable={playerEnable} level={level} name={name}/> : ''}
          {playerEnable?<Player position={[0, 1, 0]}  material={'slippery'} joystickData={joystickData} jumpBox={jumpBox} name={name} group={group}/>: <PerspectiveCamera position={[10,11,30]} makeDefault/>}

    </>
  )
}
