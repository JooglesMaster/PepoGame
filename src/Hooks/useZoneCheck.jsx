import { Vector3} from 'three'
import { useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import useGame from '../Stores/useGame'

export default function useZoneCheck(zonePosition, zoneSize) {
    const [isInZone, setIsInZone] = useState(false)
    
    const halfSize = new Vector3().copy(zoneSize).multiplyScalar(0.5)
    const minBounds = new Vector3().copy(zonePosition).sub(halfSize)
    const maxBounds = new Vector3().copy(zonePosition).add(halfSize)
    const playerPosition = useGame(state => state.playerPosition)


    useFrame(() => {

  
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
  
