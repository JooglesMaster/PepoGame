import { Debug, useContactMaterial } from '@react-three/cannon'
import Floor from '../Components/Floor'
import Obstacles from './Obstacles'
import Player from '../Components/Player'
import { useControls } from 'leva'
import MovingPlatforms from './MovingPlatforms'
import Platform from './Platforms'
import { Vector3 } from 'three'
import { useState, useRef} from 'react'
import { PlatformVelocityContext } from '../Context/PlatformVelocityContext';
import Platforms from './Platforms'
import { OrbitControls,CameraControls} from '@react-three/drei'
import JumpPads from './JumpPads'
import PlatformLarge from './PlatformLarge'
import Checker from './Checker'

function ToggleDebug({ children }) {
  const debugRendererVisible = useControls('Debug Renderer', { visible: false })

  return <>{debugRendererVisible.visible ? <Debug>{children}</Debug> : <>{children}</>}</>
}



export default function Game({playerEnable}) {

  const platformVelocityRef = useRef();



  useContactMaterial('ground', 'slippery', {
    friction: 0,
    restitution: 0.1,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3
  })
  

  return (
    <>
        <ToggleDebug>
          {/* <Floor rotation={[-Math.PI / 2, 0, 0]} material={'ground'} /> */}
          <Checker/>
          <PlatformLarge args={[5,0.2,5]} position={[1,0,0]} material={'ground'}/>
          <PlatformLarge args={[5,0.2,5]} position={[-15.239883422851562,20.5,-6.5]} material={'ground'}/>
          <Obstacles material={'ground'} />
          <MovingPlatforms material={'ground'}/>
           {playerEnable.enable ?<Player position={[0, 1, 0]}  material={'slippery'}  />: <OrbitControls makeDefault/>}
          <Platforms material={'ground'} />
          <JumpPads material={'ground'} />

        </ToggleDebug>
    </>
  )
}
