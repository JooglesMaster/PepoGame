import { useMemo, useRef,useEffect,useState, useContext } from 'react'
import { Vector3, Euler, Quaternion, Matrix4, AnimationMixer } from 'three'

import { useCompoundBody } from '@react-three/cannon'
import useKeyboard from '../Hooks/useKeyboard'
import { useFrame } from '@react-three/fiber'
import { Vec3 } from 'cannon-es'
import useFollowCam from '../Hooks/useFollowCam'
import Pepo2 from '../Character/Pepo_v2'
import Pepo3 from '../Character/Pepo_v3'
import useZoneCheck from '../Hooks/useZoneCheck'
import Zone from './Zone'
import { PlatformVelocityContext } from '../Context/PlatformVelocityContext';
import useGame from "../Stores/useGame";
import * as THREE from 'three'
import useZoneChecks from '../Hooks/useZoneChecks'
import useMoblieFollowCam from '../Hooks/useMobileFollowCam'
import useHighScoreSubmit from '../Hooks/useHighScoreSubmit'






export default function Player({ group,...props}) {
  const { pivot } = useFollowCam()
  // const { pivot } = useMoblieFollowCam()
  const canJump = useRef(false)

  const velocity = useMemo(() => new Vector3(), [])
  const inputVelocity = useMemo(() => new Vector3(), [])
  const euler = useMemo(() => new Euler(), [])
  const quat = useMemo(() => new Quaternion(), [])
  const targetQuaternion = useMemo(() => new Quaternion(), [])
  const worldPosition = useMemo(() => new Vector3(), [])
  const prevYPosition = useRef(worldPosition.y);
  const contactNormal = useMemo(() => new Vec3(0, 0, 0), [])
  const upAxis = useMemo(() => new Vec3(0, -1, 0), [])
  const deltaRef = useRef(0);

  const[jumpHeight,setJumpHeight] = useState(10)
  const mixer = useMemo(() => new AnimationMixer(), [])
  const actions = useRef({}).current;
  const [isMoving,setIsMoving] = useState(false)
  const [isLanding, setIsLanding] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  const keyboard = useKeyboard()

  //Game State

  const stopTimer = useGame((state) => state.stopTimer);
  const updatePending = useRef(false);
  const setPlayerPosition = useGame((state) => state.setPlayerPosition);
  const restart = useGame((state) => state.restart);
  const setRestart = useGame((state) => state.setRestart);
  const setElapsedTime = useGame((state) => state.setElapsedTime);
  const isInJumpPad = useGame((state) => state.isInJumpPad);
  const newLinearDamping = useRef(0.95);

  const [ref, body] = useCompoundBody(

    () => ({
      mass: 1,
      userData: { type: 'player' },
      shapes: [
        { args: [0.5], position: [0, 0.5, 0], type: 'Sphere' },
        { args: [0.3], position: [0, 1.1, 0], type: 'Sphere' }       
      ],
      onCollide: (e) => {
        if (e.contact.bi.id === e.body.id) {
          contactNormal.set(-e.contact.ni.x, -e.contact.ni.y, -e.contact.ni.z);
        } 
        else {
          contactNormal.set(...e.contact.ni)
        }
        if (contactNormal.dot(upAxis) > 0.1) {
          if (!canJump.current) {
            setIsLanding(true);
            setTimeout(() => {
              setIsLanding(false);
            }, 25);}
          if (e.body.userData && e.body.userData.type === 'obstacle') {
            const deflectionForceX = -25 * contactNormal.x;
            const deflectionForceY = -25* contactNormal.y;
            const deflectionForceZ = -25 * contactNormal.z;
            body.applyImpulse([deflectionForceX, deflectionForceY, deflectionForceZ], [0, 0, 0]);
          }
          if (!canJump.current && !isMoving) {

            actions['jump'].fadeOut()
            actions['idle'].reset().fadeIn(0.1).play()
            canJump.current = true
            setTimeout(() => {
              setIsJumping(false);
            }, 200); 
          }
          else if (!canJump.current && isMoving) {

            actions['jump'].fadeOut(0.1)
            actions['walk'].reset().fadeIn(0.1).play()

            canJump.current = true
            setTimeout(() => {
              setIsJumping(false);
            }, 200); 
          }
        }
      },
      linearDamping: 0.95,
      ...props
    }),
    useRef()
  )

  useFrame((_, delta) => {
    body.angularFactor.set(0, 0, 0)
    deltaRef.current = delta;
    ref.current.getWorldPosition(worldPosition)
    const distance = worldPosition.distanceTo(group.current.position)
    const verticalVelocity = (worldPosition.y - prevYPosition.current) / delta;

    if (canJump.current) {
      // walking
      mixer.update(delta)
    } else {
      // in the air
      mixer.update(delta)
    }


    const rotationMatrix = new Matrix4()
    rotationMatrix.lookAt(worldPosition, group.current.position, group.current.up)
    targetQuaternion.setFromRotationMatrix(rotationMatrix)
    if (!group.current.quaternion.equals(targetQuaternion) && isMoving) {
      targetQuaternion.z = 0
      targetQuaternion.x = 0
      targetQuaternion.normalize()
      group.current.quaternion.rotateTowards(targetQuaternion, delta * 10)
    }

    inputVelocity.set(0, 0, 0)
    if (keyboard['KeyW'] ) {
      inputVelocity.z = -10 * delta
    }
    if (keyboard['KeyS']) {
      inputVelocity.z = 10 * delta
    }
    if (keyboard['KeyA']) {
      inputVelocity.x = -10 * delta
    }
    if (keyboard['KeyD']) {
      inputVelocity.x = 10 * delta
    }
    if (keyboard['KeyQ']&& actions['idle']) {
        actions['idle'].fadeOut(0.1).stop()
        actions['dance'].fadeIn(0.1).play()
    }
    if (keyboard['Space'] || props.jumpBox) {
      if (canJump.current && !isLanding && !isJumping) {
        setIsJumping(true);
        canJump.current = false
        inputVelocity.y = jumpHeight
        actions['walk'].fadeOut(0.1).stop()
        actions['jump'].reset().fadeIn(0.1).play()

        // body.velocity.set(0, body.velocity.y, 0);
      }      
    }
    if (inputVelocity.x !== 0 || inputVelocity.z !== 0 || inputVelocity.y !== 0)  {
      setIsMoving(true);
      newLinearDamping.current = 0.94;
      body.linearDamping.set(newLinearDamping.current)

    } if(inputVelocity.x === 0 && inputVelocity.z === 0 && inputVelocity.y === 0 && !isJumping) {
      setIsMoving(false);
      newLinearDamping.current = 0.99999;
      body.linearDamping.set(newLinearDamping.current)

    }
    if(worldPosition.y <= -5) {
      body.position.set(1, 0, 0)
      body.velocity.set(0, 0, 0)
    }

    // Check if the player is falling
    if (verticalVelocity < -1 && !isJumping && !isLanding) {
      // Increase the vertical component of the inputVelocity (or modify as required)
      inputVelocity.y -= 30 * delta; // 5 is an arbitrary value; adjust as needed
      setIsJumping(true); // Set jumping state
      canJump.current = false; // Set jump state to false to prevent repeated jumping
  
      actions['jump'].reset().fadeIn(0.1).play(); // Play jump animation
      actions['walk'].fadeOut(0.1).stop();

    }

    // Update the previous Y position for the next frame
    prevYPosition.current = worldPosition.y;

    

      euler.y = pivot.rotation.y
      euler.order = 'XYZ'
      quat.setFromEuler(euler)
      inputVelocity.applyQuaternion(quat)
      velocity.set(inputVelocity.x, inputVelocity.y, inputVelocity.z)

      body.applyImpulse([velocity.x, velocity.y, velocity.z], [0, 0, 0])
    
    group.current.position.lerp(worldPosition, 0.1)
    pivot.position.lerp(worldPosition, 0.2)

    if (!updatePending.current) {
      updatePending.current = true;
      
      setTimeout(() => {
        setPlayerPosition({
          x: worldPosition.x,
          y: worldPosition.y,
          z: worldPosition.z,
        });
        
        updatePending.current = false;
      }, 100); 
    }
    if(restart) {
      body.position.set(1, 0.5, 0)
      body.velocity.set(0, 0, 0)
      stopTimer()
      setElapsedTime(0)
      setRestart(false)
    }
    if(keyboard['KeyR']) {
      setRestart(true)
    }

  })






  useEffect(() => {
    if (isMoving && canJump.current && actions['walk'] && !isLanding) {
      actions['idle'].fadeOut(0.1).stop();
      actions['dance'].fadeOut(0.1).stop();
      actions['walk'].fadeIn(0.1).play();
    } else if (!isMoving && canJump.current && actions['idle'] && !isLanding) {

        actions['walk'].fadeOut(0.1).stop();
        actions['idle'].fadeIn(0.1).play();

    }
  }, [isMoving, canJump.current, actions, isLanding])

  



  // Zone Check

  const zonePositionStart = new Vector3(1, 1, -3)
  const zoneSizeStart = new Vector3(5, 3, 3)

  const zonePositionEnd = new Vector3(-15.239883422851562,22,-6.5)
  const zoneSizeEnd = new Vector3(5, 3, 5)
  

  const isInZoneStart = useZoneCheck(zonePositionStart, zoneSizeStart)
  const isInZoneEnd = useZoneCheck( zonePositionEnd, zoneSizeEnd)


  useEffect(() => {
    if (isInJumpPad) {
      setJumpHeight(50)
      console.log('jump', isInJumpPad)
    }
    else {
      setJumpHeight(10)
    }
  }, [isInJumpPad])











  return (
    <>
      <group ref={group}>
        {/* <Pepo mixer={mixer} actions={actions} /> */}
        <Pepo3 mixer={mixer} actions={actions} />
      </group>
      {/* <Zone position={zonePositionStart.toArray()} size={zoneSizeStart.toArray()} />
      <Zone position={zonePositionEnd.toArray()} size={zoneSizeEnd.toArray()} />
      <Zone position={jumpLocation3.toArray()} size={jumpSize3.toArray()} /> */}
    </>
  )
}
