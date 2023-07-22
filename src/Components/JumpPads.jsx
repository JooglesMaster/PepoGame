import { useBox } from "@react-three/cannon";
import { Box, TransformControls } from "@react-three/drei";
import{useRef} from 'react';
import data from '../Character/output.json';

 function JumpPad({ position, args, ...props}) {
    const [ref] = useBox(() => ({ 
        type: "Static",
        position: position,
        args: args,
        ...props,
        collisionFilterGroup: 1,
        collisionFilterMask: 1,
        margin: 0.5, // Adds a 0.5 unit margin around the platform
        }), useRef())



  return (
    <Box args={args} ref={ref}>
      <meshStandardMaterial color="green" />
    </Box>
  );
}




const JumpPads = ({ material }) => {

  const platforms = Object.values(data.jumpPad).map((object, index) => {

    const position = [object.location[0], object.location[2], object.location[1]]

    const args = [1, 0.2, 1]; // You can customize the size of the platforms here

    console.log('jumppad',object)
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
