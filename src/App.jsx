import { Canvas } from '@react-three/fiber'
import { Stats, useProgress, Html, OrbitControls,Text,Float} from '@react-three/drei'
import Game from './Components/Game'
import { Physics } from '@react-three/cannon'
import { Suspense, useState} from 'react'
import { useControls } from 'leva'
import Lights from './Components/Lights'
import MediaPlayer from './Components/MediaPlayer'
import Interface from './Components/Interface'
import { useJoyStick } from './Hooks/useJoyStick'
import useDeviceDetect from './Hooks/useDeviceDetect'
import InputName from './Components/InputName'
import LevelSelect from './Components/SelectLevel'



function Loader() {
  const { progress } = useProgress()
  return <h1 >{progress} % loaded</h1>
}

export default function App() {

  const [playerEnable, setPlayerEnable] = useState(false);
  const {renderJoystick, joystickData} = useJoyStick();
  const[jumpBox,setJumpBox] = useState(false)
  const { isMobile } = useDeviceDetect();
  const [name,setName] = useState('')
  const [level, setLevel] = useState(1);

  const handleJumpClick = () => {
    setJumpBox(true);
    setTimeout(() => {
      setJumpBox(false);
    }, 10);
  };



  

  return (
    <>
    <Suspense fallback={<Loader />}>
{      <Canvas  shadows  onPointerDown={(e) => !isMobile ? e.target.requestPointerLock(): ''} >       
            <Lights />
            <Physics>
              <Game playerEnable={playerEnable} joystickData={joystickData} jumpBox={jumpBox} name={name} level={level}/>
            </Physics>
            {!playerEnable?<Float speed={2.5} position={[10, 12, 25]}> 
              <Text fontSize={0.5}  color={'gold'}>Pepo Jump</Text>
            </Float>:''}
            {/* <Stats /> */}
        </Canvas>}
      <Interface />
      <InputName name={name} setName={setName} playerEnable={playerEnable} setPlayerEnable={setPlayerEnable}/>
      <MediaPlayer />
      <LevelSelect setLevel={setLevel} playerEnable={playerEnable}/>
      {/* {isMobile? renderJoystick():''}
      { isMobile?<div className="jump-container" onClick={handleJumpClick}>
        <div className="jump-button"></div>
      </div>:''} */}
    </Suspense>
    </>
  )
}
