import React, { useRef, useState,useEffect } from 'react';
import { useGLTF,Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import useZoneCheck from '../Hooks/useZoneCheck';
import useGame from '../Stores/useGame'
import { useBox } from "@react-three/cannon";




function Breakable({ position, args, ...props }) {
    const [rendered, setRendered] = useState(true);
    const zoneSize = new Vector3(1.5, 2, 1.5);
    const zonePosition = new Vector3(position[0], position[1], position[2]);
    const materialRef = useRef(); 
    const [fade, setFade] = useState(1);
    const isInZone = useZoneCheck(zonePosition, zoneSize);
    const restart = useGame(state => state.restart);

    if(restart){
      console.log("restart")
    }

    const [ref, api] = useBox(() => ({
        type: "Static",
        position: position,
        args: args,
        ...props,
        collisionFilterGroup: 1,
        collisionFilterMask: 1,
        margin: 0.5,
    }));


    useEffect(() => {
        if (isInZone && rendered) {
            setTimeout(() => {
                api.position.set(0, -100, 0);
                setRendered(false);

            }, 1000);

        }
    }, [isInZone, rendered, api]);

    useEffect(() => {
      if (restart) { // Restart condition
          console.log("Position on Restart: ", position);  // Debug the position
          api.position.set(...position); // Reset position to the initial value
          setRendered(true); // Make it rendered again
          setFade(1); // Reset fade
          console.log("restart")
      }
  }, [restart, position, api]);

    useFrame((_, delta) => {
        if (isInZone) {
            if (fade > 0) {
                setFade(fade - delta * 1);
            }
        }
    });

    if(restart){
      console.log("restart")
    }

    
    

    
    return (
        <>
        {rendered && (
            <Box args={args} ref={ref} receiveShadow>
              <meshStandardMaterial color="#03adfc" opacity={fade} transparent  />
            </Box>
        )}

        </>
    );
}





const Breakables = ({ material,data }) => {

  const breakables = Object.values(data.breakable).map((object, index) => {

    const position = [object.location[0], object.location[2], object.location[1]]

    const args = [1, 0.2, 1]; 


    return (
      <Breakable
        key={index}
        position={position}
        args={args}
        material={material}
        data={data}
      />
    );
  });

  return <>{breakables}</>;
};

export default Breakables;
