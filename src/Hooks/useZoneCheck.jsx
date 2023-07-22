import { Vector3} from 'three'
import { useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'

export default function useZoneCheck(playerRef,canJump,zonePosition, zoneSize) {
    const [isInZone, setIsInZone] = useState(false)
    
    const halfSize = new Vector3().copy(zoneSize).multiplyScalar(0.5)
    const minBounds = new Vector3().copy(zonePosition).sub(halfSize)
    const maxBounds = new Vector3().copy(zonePosition).add(halfSize)
    

    useFrame(() => {
      const playerPosition = playerRef.current.position
  
      if (playerPosition.x >= minBounds.x && playerPosition.x <= maxBounds.x &&
          playerPosition.y >= minBounds.y && playerPosition.y <= maxBounds.y &&
          playerPosition.z >= minBounds.z && playerPosition.z <= maxBounds.z) {
        if (!isInZone) {
          setIsInZone(true)
        }
      } else {
        if (isInZone) {
          setIsInZone(false)
        }
      }
    })
  
    return isInZone
  }
  
