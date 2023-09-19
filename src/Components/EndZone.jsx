import { useBox } from "@react-three/cannon";
import { Box, TransformControls } from "@react-three/drei";
import{useRef,useEffect,} from 'react';
import Checker from './Checker'
import useGame from '../Stores/useGame'
import useZoneCheck from '../Hooks/useZoneCheck';
import useHighScoreSubmit from '../Hooks/useHighScoreSubmit';
import { Vector3 } from 'three';

export default function EndZone({ position, args,level,checkerPosition, ...props}) {

    const setStart = useGame((state) => state.setStart);
    const start = useGame((state) => state.start);
    const elapsedTime = useGame((state) => state.elapsedTime);
    const stopTimer = useGame((state) => state.stopTimer);
    const [sendHighScore] = useHighScoreSubmit();

    const zoneSize = new Vector3(5, 6, 2)
    const zonePosition= new Vector3(checkerPosition[0], checkerPosition[1]+2, checkerPosition[2])

    const isInZoneEnd = useZoneCheck(zonePosition, zoneSize);
    useEffect(() => {
        if (isInZoneEnd) {
          stopTimer();
          setStart(false)
          let highScore = {
            name: props.name,
            score: elapsedTime,
            time: elapsedTime,
            level: level
          }
    
          sendHighScore(highScore);
          console.log('Elapsed time:', elapsedTime, 'seconds');
          console.log('end', start)
        }
        else {
        }
    }, [isInZoneEnd])
    
    const [ref] = useBox(() => ({ 
        type: "Static",
        position: position,
        args: args,
        ...props,
        collisionFilterGroup: 1,
        collisionFilterMask: 1,
        margin: 0.5, 
    }), useRef())

    console.log(position[1])

  return (
    <group>
    <Box args={args} ref={ref} position={position} receiveShadow >
      <meshStandardMaterial color="grey" />
    </Box>
    <Checker position={checkerPosition} rotation={[0,Math.PI / 2,0]} />
    {/* <Box args={zoneSize.toArray()} position={zonePosition.toArray()} receiveShadow rotation={[0,Math.PI / 2,0]}>
        <meshStandardMaterial color="grey" wireframe/>
    </Box> */}
    </group>
  );
}


