import React from 'react'
import { DirectionalLight,AmbientLight } from '@react-three/fiber'

const Lights = () => {
  return (
    <>
      <directionalLight
        castShadow
        position={[-20, 30, -10]}
        intensity={3}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-top={50}
        shadow-camera-right={50}
        shadow-camera-bottom={-50}
        shadow-camera-left={-50}
      />
      <ambientLight intensity={1}  />
    </>
  )
}

export default Lights
