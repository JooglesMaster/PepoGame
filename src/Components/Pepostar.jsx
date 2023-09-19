import React, { useRef, useState,useEffect } from 'react';
import { useGLTF,Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import useZoneCheck from '../Hooks/useZoneCheck';
import useGame from '../Stores/useGame'





export default function Pepostar(props) {
  const { nodes, materials } = useGLTF('./models/pepostar.glb');
  const [rendered, setRendered] = useState(true);
  const [selection, setSelection] = useState([]);
  const playerPosition = useGame(state => state.playerPosition)
  const incrementPepostars = useGame(state => state.incrementPepostars);
  const groupRef = useRef();
  const meshRef = useRef();


  const zoneSize = new Vector3(2, 2, 2)
  const zonePosition= new Vector3(props.position[0], props.position[1], props.position[2])


  const isInZone = useZoneCheck(zonePosition, zoneSize)

  useEffect(() => {
    if (meshRef.current) {
      setSelection([meshRef.current]);
    }
  }, [meshRef.current]);

  useFrame(() => {
    if (rendered && groupRef.current) {
      const rotationSpeed = 0.02;  // Adjust this to your preference
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  useEffect(() => {
    if (isInZone && rendered) {
      setRendered(false)
      incrementPepostars();
    }
  }, [isInZone])

  return (
    <>

      {rendered && (
        <group ref={groupRef} {...props} dispose={null}>
          <mesh ref={meshRef} geometry={nodes.Cylinder.geometry} material={materials['Material.001']} scale={0.2} />
        </group>
      )}

    </>
  );
}

useGLTF.preload('./models/pepostar.glb');
