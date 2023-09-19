import { useBox } from "@react-three/cannon";
import { Box, TransformControls } from "@react-three/drei";
import{useRef} from 'react';

 function Platform({ position, args, ...props}) {
    const [ref] = useBox(() => ({ 
        type: "Static",
        position: position,
        args: args,
        ...props,
        collisionFilterGroup: 1,
        collisionFilterMask: 1,
        margin: 2, // Adds a 0.5 unit margin around the platform
        }), useRef())



  return (
    <Box args={args} ref={ref} receiveShadow>
      <meshStandardMaterial color="brown" />
    </Box>
  );
}




const Platforms = ({ material,data }) => {

  const platforms = Object.values(data.objects).map((object, index) => {

    const position = [object.location[0], object.location[2], object.location[1]]

    const args = [1, 0.2, 1]; 


    return (
      <Platform
        key={index}
        position={position}
        args={args}
        material={material}
        data={data}
      />
    );
  });

  return <>{platforms}</>;
};

export default Platforms;
