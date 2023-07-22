import { useBox } from "@react-three/cannon";
import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { PlatformVelocityContext } from '../Context/PlatformVelocityContext.js'; // this path should point to your actual context definition file
import { useState } from 'react';
import data from '../Character/output.json';

function Obstacle({ position, args, speed = 1, direction = new Vector3(0, 0, 0), platformVelocityRef, ...props}) {


  const [ref, api] = useBox(() => ({ 
    type: "Kinematic",
    position: position,
    args: args,
    ...props,
    collisionFilterGroup: 1,
    collisionFilterMask: 1,
    margin: 0.5, // Adds a 0.5 unit margin around the platform
  }));

  const startPosition = new Vector3(...position);


  // Update the platform's position on every frame
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const moveVector = direction.clone().multiplyScalar(Math.sin(elapsedTime * speed) * 5); // The value 5 controls the amplitude of the oscillation
    const newPosition = startPosition.clone().add(moveVector);
    api.position.set(newPosition.x, newPosition.y, newPosition.z);
    if (platformVelocityRef && platformVelocityRef.current) {
      api.velocity.subscribe((velocity) => {
        platformVelocityRef.current = (new Vector3(...velocity));
      });
    }
  });

  console.log('api', api.velocity)

  return (

      <Box args={args} ref={ref}>
        <meshStandardMaterial color="blue" />
      </Box>

  );
}


const Obstacles = ({ material }) => {

  const platforms = Object.values(data.obstacles).map((object, index) => {

    const position = [object.location[0], object.location[2], object.location[1]]

    const args = [4, 0.5, 1]; // You can customize the size of the platforms here

    console.log('mvoing', object)

    return (
      <Obstacle
        key={index}
        position={position}
        args={args}
        material={material}
        direction={new Vector3(0,1,0)}
      />
    );
  });


  return <>{platforms}</>;
};

export default Obstacles;
