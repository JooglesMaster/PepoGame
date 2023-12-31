/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.5 trampoline.glb
*/
import { useBox } from "@react-three/cannon";
import React, { useEffect, useRef } from 'react'
import { useGLTF,Box } from '@react-three/drei'
import { Vector3 } from 'three';
import useGame from '../Stores/useGame'
import useZoneCheck from '../Hooks/useZoneCheck';

function JumpPad({position, args, ...props}) {
  const { nodes, materials } = useGLTF('./models/trampoline.glb')
  const zoneSize = new Vector3(3, 3, 3);
  const zonePosition = new Vector3(position[0], position[1], position[2]);
  const setIsInJumpPad = useGame(state => state.setIsInJumpPad);

  args = [2.2, 0.2, 2.2]; 




  const [ref] = useBox(() => ({ 
    type: "Static",
    position: position,
    args: args,
    ...props,
    collisionFilterGroup: 1,
    collisionFilterMask: 1,
    margin: 10, // Adds a 0.5 unit margin around the platform
    }), useRef())

    const isInZone = useZoneCheck(zonePosition, zoneSize);



    useEffect (() => {
      if(isInZone){
        setIsInJumpPad(true)
  
      }else {
        setIsInJumpPad(false)

      }
    }, [isInZone])





  return (
    <>
    <group {...props} dispose={null} ref={ref}>
      <mesh geometry={nodes.Cylinder.geometry} material={materials['Material.001']} />
      <mesh geometry={nodes.Cylinder001_Curve.geometry} material={materials['Material.003']} />
      <mesh geometry={nodes.Cylinder002.geometry} material={materials['Material.002']} />
    </group>
    {/* <mesh position={zonePosition.toArray()} >
      <boxGeometry args={zoneSize.toArray()} />
      <meshBasicMaterial color="red" wireframe />
    </mesh> */}
    </>



    

    
  )
}

useGLTF.preload('./models/trampoline.glb')






const JumpPads = ({ material,data}) => {

const platforms = Object.values(data.jumpPad).map((object, index) => {

  const position = [object.location[0], object.location[2], object.location[1]]

  const args = [1, 0.2, 1]; // You can customize the size of the platforms here

  return (
    <JumpPad
      key={index}
      position={position}
      args={args}
      material={material}
    />
  );
});

return <>{platforms}</>;
};

export default JumpPads;
