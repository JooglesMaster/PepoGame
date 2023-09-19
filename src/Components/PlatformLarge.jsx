import { useBox } from "@react-three/cannon";
import { Box, TransformControls } from "@react-three/drei";
import{useRef} from 'react';

export default function PlatformLarge({ position, args, ...props}) {
    
    const [ref] = useBox(() => ({ 
        type: "Static",
        position: position,
        args: args,
        ...props,
        collisionFilterGroup: 1,
        collisionFilterMask: 1,
        margin: 0.5, 
        }), useRef())

  return (
    <Box args={args} ref={ref} receiveShadow>
      <meshStandardMaterial color="grey" />
    </Box>
  );
}


