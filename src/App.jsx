import { Canvas } from '@react-three/fiber'
import { Stats, useProgress, Html, OrbitControls } from '@react-three/drei'
import Game from './Components/Game'
import { Physics } from '@react-three/cannon'
import { Suspense } from 'react'
import { useControls } from 'leva'
import Lights from './Components/Lights'
import MediaPlayer from './Components/MediaPlayer'
import Interface from './Components/Interface'

function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

export default function App() {

  const playerEnable = useControls('Player', { enable: false })

  return (
    <>
{      <Canvas shadows onPointerDown={(e) => playerEnable.enable ? e.target.requestPointerLock(): ''}>
        <Suspense fallback={<Loader />}>
          <Lights />
          <Physics>
            <Game playerEnable={playerEnable}/>
          </Physics>
          <Stats />
        </Suspense>
      </Canvas>}
      <Interface />
      <MediaPlayer />

    </>
  )
}
