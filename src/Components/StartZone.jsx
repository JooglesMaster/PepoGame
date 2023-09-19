import { useBox } from "@react-three/cannon";
import { Box, TransformControls } from "@react-three/drei";
import{useRef,useEffect,} from 'react';
import Checker from './Checker'
import useGame from '../Stores/useGame'
import useZoneCheck from '../Hooks/useZoneCheck';
import useHighScoreSubmit from '../Hooks/useHighScoreSubmit';
import { Vector3 } from 'three';

export default function EndZone({ position, args,checkerPosition, ...props}) {

    const setStart = useGame((state) => state.setStart);
    const start = useGame((state) => state.start);
    const startTimer = useGame((state) => state.startTimer);
    const zoneSize = new Vector3(5, 4, 2)
    const zonePosition= new Vector3(checkerPosition[0], checkerPosition[1], checkerPosition[2])


    const isInZoneStart = useZoneCheck(zonePosition, zoneSize);
    useEffect(() => {
        if (isInZoneStart) {
          setStart(true)
          startTimer()
          console.log('start', start)
        }
      }, [isInZoneStart])
    
    const [ref] = useBox(() => ({ 
        type: "Static",
        position: position,
        args: args,
        ...props,
        collisionFilterGroup: 1,
        collisionFilterMask: 1,
        margin: 0.5, 
    }), useRef())

    if(isInZoneStart){
        console.log("start")
    }

  return (
    <group>
    <Box args={args} ref={ref} receiveShadow>
      <meshStandardMaterial color="grey" />
    </Box>
    {/* <Box args={zoneSize.toArray()} position={zonePosition.toArray()} receiveShadow>
        <meshStandardMaterial color="grey" />
    </Box> */}
    <Checker position={checkerPosition}/>
    </group>
  );
}


