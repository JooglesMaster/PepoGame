import React, { useEffect, useRef, useState,Suspense } from 'react';
import { useGLTF, shaderMaterial, Cylinder} from '@react-three/drei';
import { extend,useFrame,useThree} from '@react-three/fiber';
import { ShaderMaterial, UniformsUtils, Vector3 } from 'three';
import useGame from '../Stores/useGame';
import fragmentShader from '../Shaders/fragment.js';
import vertexShader from '../Shaders/vertext.js'; 
import * as THREE from "three";




const SpaceShipMaterial = shaderMaterial(
  {
    time: { value: 0.0 }
  },
  vertexShader,
  fragmentShader,
  (material) => {
    material.transparent = false;
  }
);

extend({ SpaceShipMaterial });


export default function SpaceShip(props) {
  const { nodes, materials } = useGLTF('./models/spaceship2.glb');
  const spaceRef = useRef();
  const [rendered, setRendered] = useState(false);
  const pepostarsCollected = useGame(state => state.pepostarsCollected);
  const [isAnimating, setIsAnimating] = useState(true);
  const lerpFactor = useRef(0.1); //having at ref stops it upsdateding each frame

  const startPos = new Vector3(25, 7, -35);
  const endPos = new Vector3(25, 7, -4);

  const uniforms = UniformsUtils.merge([
    {
      time: { value: 0.0 }
    }
  ]);

  useEffect(() => {
    if(pepostarsCollected === 3){
      setRendered(true);
    }
  }, [pepostarsCollected]);

  useFrame((state, delta) => {
    if (rendered && isAnimating) {
      lerpFactor.current += delta * 0.5;
      lerpFactor.current = Math.min(lerpFactor.current, 1);

      const newPos = new Vector3().lerpVectors(startPos, endPos, lerpFactor.current);
      spaceRef.current.position.copy(newPos);

      if (lerpFactor.current >= 1) {
        setIsAnimating(false);
      }
    }
    if(rendered){
      const rotationSpeed = 0.02;
      spaceRef.current.rotation.y += rotationSpeed;

      if (uniforms && uniforms.time) {
        uniforms.time.value += delta;
      }
    }
  });



  materials.Glow_Mat.emissiveIntensity = 0;

  return (
    <>
      {rendered && (
        <group {...props} dispose={null} ref={spaceRef}>
          <mesh geometry={nodes.Cylinder_1.geometry} material={materials.SpaceShip_Mat} castShadow />
          <mesh geometry={nodes.Cylinder_2.geometry} material={materials.Glow_Mat} castShadow />
          {!isAnimating && (
            <Suspense fallback={null}>
            <Cylinder args={[1.2, 1.2, 3, 32]} position={[0,-1.5,0]}>
              <meshStandardMaterial color={'#00ffd5'} opacity={0.9} transparent={true}/>
            </Cylinder>
            </Suspense>
          )}
          <pointLight
          position={[25,5,-4]}
          color={'cyan'}
          />
        </group>
      )}
    </>
  );
}

useGLTF.preload('./models/spaceship2.glb');
