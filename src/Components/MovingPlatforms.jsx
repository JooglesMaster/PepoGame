import { useBox } from "@react-three/cannon";
import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3,Clock } from "three";
import { PlatformVelocityContext } from '../Context/PlatformVelocityContext.js'; // this path should point to your actual context definition file
import { useState, useEffect,useRef} from 'react';
import { MathUtils  } from 'three';
import usePlatformCheck from '../Hooks/usePlatformCheck';
import useZoneCheck from "../Hooks/useZoneCheck.jsx";

function MovingPlatform({ position, args, speed, direction = new Vector3(1, 0, 0), platformVelocityRef, playerRef, ...props}) {
  const [ref, api] = useBox(() => ({ 
    type: "Kinematic",
    position: position,
    args: args,
    ...props,
    collisionFilterGroup: 1,
    collisionFilterMask: 1,
    margin: 2, // Adds a 0.5 unit margin around the platform
  }));
  const startPosition = new Vector3(...position);
  const [isMoving, setIsMoving] = useState(true); // Initialize isMoving state
  const zoneSize = new Vector3(2,5,10);
  const zonePosition = new Vector3(position[0], position[1], position[2]);
  const clockRef = useRef(new Clock(false));
  const [lastElapsedTime, setLastElapsedTime] = useState(0);

  // Check if the player is on the platform
  const isOnPlatform = useZoneCheck(zonePosition,zoneSize)
  
  // Update the isMoving state whenever isOnPlatform changes
  useEffect(() => {
    setTimeout(() => {
      setIsMoving(isOnPlatform);
    }, 300);
  }, [isOnPlatform]);

  useEffect(() => {
    // If the platform is not moving, store the last elapsed time
    if (isMoving && clockRef.current.running) {
      setLastElapsedTime(clockRef.current.getElapsedTime());
      clockRef.current.stop(); // Stop the clock
    }

    // If the platform should move, resume the clock with the last elapsed time
    if (!isMoving && !clockRef.current.running) {
      clockRef.current.start();
      clockRef.current.elapsedTime = lastElapsedTime;
    }
  }, [isMoving]);


  // Update the platform's position on every frame
  useFrame(() => {
    if (!isMoving && clockRef.current.running) {
      const elapsedTime = clockRef.current.getElapsedTime();
      const moveVector = direction.clone().multiplyScalar(Math.sin(elapsedTime * speed) * 2);
      const newPosition = startPosition.clone().add(moveVector);
      api.position.set(newPosition.x, newPosition.y, newPosition.z);
      // ...
    } else {
      // If the platform should not move, stop the clock and reset the elapsed time
      if (clockRef.current.running) {
        clockRef.current.stop();
        clockRef.current.elapsedTime = 0; // Reset the elapsed time
      }
    }
  });



  return (
    <>
    <Box args={args} ref={ref}>
    <meshStandardMaterial color={!isMoving ? 'blue': 'brown'} />
    </Box>
    {/* <Box args={[1.5,5,10]} position={position}>
      <meshStandardMaterial color="grey" opacity={0.5} transparent={true} />
    </Box> */}
    </>

      
  );
}

const MovingPlatforms = ({ material,data }) => {

  const platforms = Object.values(data.movingPlatform).map((object, index) => {

    const position = [object.location[0], object.location[2], object.location[1]]

    const args = [1, 0.2, 1]; // You can customize the size of the platforms here

    const speed = MathUtils.randFloat(1, 2); // Generate a random speed between 0.5 and 2



    return (
      <MovingPlatform
        key={index}
        position={position}
        args={args}
        material={material}
        direction={new Vector3(0,0,1)}
        speed={speed}
      />
    );
  });

  return <>{platforms}</>;
};

export default MovingPlatforms;

