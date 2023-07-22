import { useMemo, useRef,useEffect,useState, useContext } from 'react'
import { Vector3, Euler, Quaternion, Matrix4, AnimationMixer } from 'three'

import { useCompoundBody } from '@react-three/cannon'
import useKeyboard from '../Hooks/useKeyboard'
import { useFrame } from '@react-three/fiber'
import { Vec3 } from 'cannon-es'
import useFollowCam from '../Hooks/useFollowCam'
import Pepo2 from '../Character/Pepo_v2'
import useZoneCheck from '../Hooks/useZoneCheck'
import Zone from './Zone'
import { PlatformVelocityContext } from '../Context/PlatformVelocityContext';
import useGame from "../Stores/useGame";
import * as THREE from 'three'
import data from '../Character/output.json';
import useZoneChecks from '../Hooks/useZoneChecks'





export default function Player(props) {
  const { pivot } = useFollowCam()
  const canJump = useRef(false)
  const group = useRef()
  const velocity = useMemo(() => new Vector3(), [])
  const inputVelocity = useMemo(() => new Vector3(), [])
  const euler = useMemo(() => new Euler(), [])
  const quat = useMemo(() => new Quaternion(), [])
  const targetQuaternion = useMemo(() => new Quaternion(), [])
  const worldPosition = useMemo(() => new Vector3(), [])
  const contactNormal = useMemo(() => new Vec3(0, 0, 0), [])
  const upAxis = useMemo(() => new Vec3(0, -1, 0), [])

  const[jumpHeight,setJumpHeight] = useState(10)





  const mixer = useMemo(() => new AnimationMixer(), [])
  const actions = useRef({}).current;
  const [isMoving,setIsMoving] = useState(false)
  const [isLanding, setIsLanding] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

 


  const keyboard = useKeyboard()

  //Game State
  const setStart = useGame((state) => state.setStart);
  const start = useGame((state) => state.start);
  
  const startTimer = useGame((state) => state.startTimer);
  const stopTimer = useGame((state) => state.stopTimer);

  const newLinearDamping = useRef(0.95);


  console.log('moving',isMoving)
  console.log('landing',isLanding)
  console.log('jumping',isJumping)


  const [ref, body] = useCompoundBody(

    () => ({
      mass: 1,
      shapes: [
        { args: [0.5], position: [0, 0.5, 0], type: 'Sphere' },
        { args: [0.3], position: [0, 1.1, 0], type: 'Sphere' }       
      ],
      onCollide: (e) => {
        if (e.contact.bi.id === e.body.id) {
          e.contact.ni.negate(contactNormal)
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
          if (!canJump.current && !isMoving) {

            actions['jump'].fadeOut()
            actions['idle'].reset().fadeIn(0.1).play()
            canJump.current = true
            setTimeout(() => {
              setIsJumping(false);
            }, 200); // Add this line
          }
          else if (!canJump.current && isMoving) {

            actions['jump'].fadeOut(0.1)
            actions['walk'].reset().fadeIn(0.1).play()

            canJump.current = true
            setTimeout(() => {
              setIsJumping(false);
            }, 200); // Add this line
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

    ref.current.getWorldPosition(worldPosition)
    const distance = worldPosition.distanceTo(group.current.position)

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
    if (document.pointerLockElement) {
      inputVelocity.set(0, 0, 0)
      if (keyboard['KeyW']) {
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
      if (keyboard['Space']) {
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
    

      euler.y = pivot.rotation.y
      euler.order = 'XYZ'
      quat.setFromEuler(euler)
      inputVelocity.applyQuaternion(quat)
      velocity.set(inputVelocity.x, inputVelocity.y, inputVelocity.z)

      body.applyImpulse([velocity.x, velocity.y, velocity.z], [0, 0, 0])
    }
    group.current.position.lerp(worldPosition, 0.1)

    pivot.position.lerp(worldPosition, 0.2)

    

    
  })


  console.log('body', body.linearDamping)

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

  
  console.log('actions idle', actions['idle'])


  // Zone Check


  const jumpLocation1 = new Vector3(18.29828643798828, 4.884661674499512, -6.458457946777344);
  const jumpSize1 = new Vector3(1, 1, 2);

  const jumpLocation2 = new Vector3(9.132315635681152, 9, -6.458457946777344);
  const jumpSize2 = new Vector3(1, 1, 2);

  const jumpLocation3 = new Vector3(0.3650665283203125, 14.697461128234863, -6.458457946777344);
  const jumpSize3 = new Vector3(1, 1, 2);

  const zonePositionStart = new Vector3(1, 1, -3)
  const zoneSizeStart = new Vector3(5, 3, 3)

  const zonePositionEnd = new Vector3(-15.239883422851562,22,-6.5)
  const zoneSizeEnd = new Vector3(5, 3, 5)
  

  const isInZoneStart = useZoneCheck(group, canJump, zonePositionStart, zoneSizeStart)
  const isInZoneEnd = useZoneCheck(group, canJump, zonePositionEnd, zoneSizeEnd)
  const isInJumpPad1 = useZoneCheck(group, canJump, jumpLocation1, jumpSize1)
  const isInJumpPad2 = useZoneCheck(group, canJump, jumpLocation2, jumpSize2)
  const isInJumpPad3 = useZoneCheck(group, canJump, jumpLocation3, jumpSize3)




  useEffect(() => {
    if (isInJumpPad1) {
      setJumpHeight(50)

    }
    else {
      setJumpHeight(10)
    }
  }, [isInJumpPad1])

  useEffect(() => {
    if (isInJumpPad2) {
      setJumpHeight(50)

    }
    else {
      setJumpHeight(10)
    }
  }, [isInJumpPad2])

  useEffect(() => {
    if (isInJumpPad3) {
      setJumpHeight(50)
    }
    else {
      setJumpHeight(10)
    }
  }, [isInJumpPad3])

  useEffect(() => {


  }, [worldPosition])

  
  


  useEffect(() => {
    if (isInZoneStart) {
      setStart(true)
      startTimer()
      console.log('start', start)
    }
  }, [isInZoneStart])

  useEffect(() => {
    if (isInZoneEnd) {
      const elapsedTime = stopTimer();
      
      console.log('Elapsed time:', elapsedTime, 'seconds');
      console.log('end', start)
    }
    else {
    }
  }, [isInZoneEnd])










  return (
    <>
      <group ref={group}>
        {/* <Pepo mixer={mixer} actions={actions} /> */}
        <Pepo2 mixer={mixer} actions={actions} />
      </group>
      {/* <Zone position={zonePositionStart.toArray()} size={zoneSizeStart.toArray()} />
      <Zone position={zonePositionEnd.toArray()} size={zoneSizeEnd.toArray()} />
      <Zone position={jumpLocation3.toArray()} size={jumpSize3.toArray()} /> */}
    </>
  )
}
