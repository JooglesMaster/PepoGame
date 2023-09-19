import { useBox } from "@react-three/cannon";
import { Box, TransformControls } from "@react-three/drei";
import{useRef} from 'react';
import Pepostar from "./Pepostar";

const Pepostars = ({data }) => {

    const pepostars = Object.values(data.pepostar).map((object, index) => {
  
    const position = [object.location[0], object.location[2], object.location[1]]
  
  
      return (
          <Pepostar
          key={index}
          position={position}
          data={data}
          /> 
      );
    });
  
    return <>{pepostars}</>;
  };
  
  export default Pepostars;