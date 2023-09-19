import { useBox } from "@react-three/cannon";
import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { PlatformVelocityContext } from '../Context/PlatformVelocityContext.js'; // this path should point to your actual context definition file
import { useState } from 'react';
import { MathUtils  } from 'three';

function Obstacle({ position, args, speed,flip, direction = new Vector3(0, 0, 0), platformVelocityRef, ...props}) {

  const newSpeed = MathUtils.randFloat(speed, speed/2); // Generate a random speed between 0.5 and 2
  const [ref, api] = useBox(() => ({ 
    type: "Kinematic",
    position: position,
    mass: 1000,
    args: args,
    ...props,
    collisionFilterGroup: 1,
    collisionFilterMask: 1,
    linearDamping: 0.1,
    userData: { type: 'obstacle' },
    margin: 5, // Adds a 0.5 unit margin around the platform
  }));

  const startPosition = new Vector3(...position);


  // Update the platform's position on every frame
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const moveVector = direction.clone().multiplyScalar(Math.sin(elapsedTime * newSpeed) * 5); // The value 5 controls the amplitude of the oscillation
    const newPosition = startPosition.clone().add(moveVector);
    api.position.set(newPosition.x, newPosition.y, newPosition.z);
    if (platformVelocityRef && platformVelocityRef.current) {
      api.velocity.subscribe((velocity) => {
        platformVelocityRef.current = (new Vector3(...velocity));
      });
    }
  });

  if(flip){
    api.rotation.set(0, Math.PI / 2, 0);
  }




  return (

      <Box args={args} ref={ref}>
        <meshStandardMaterial color="blue" />
      </Box>

  );
}


const Obstacles = ({ material,data,speed }) => {

  const platforms = Object.values(data.obstacles).map((object, index) => {

    const position = [object.location[0], object.location[2], object.location[1]]

    const args = [4, 2, 0.15]; // You can customize the size of the platforms here

    // Generate a random speed for each obstacle


    return (
      <Obstacle
        key={index}
        position={position}
        flip={object.flip}
        args={args}
        material={material}
        direction={new Vector3(0,1,0)}
        speed={speed}  // Pass the random speed to the Obstacle
        data={data}
      />
    );
  });

  return <>{platforms}</>;
};

export default Obstacles;
