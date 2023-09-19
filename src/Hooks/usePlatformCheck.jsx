import { useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3} from 'three'

export default function usePlatformCheck(playerRef, platformRef) {
    const [isOnPlatform, setIsOnPlatform] = useState(false)
    const [platformBounds, setPlatformBounds] = useState({ min: new Vector3(), max: new Vector3() })

    useFrame(() => {
        if (platformRef && platformRef.current) {
            platformRef.current.geometry.computeBoundingBox();
            platformRef.current.updateMatrixWorld();
            const box = platformRef.current.geometry.boundingBox.clone().applyMatrix4(platformRef.current.matrixWorld);
            setPlatformBounds({ min: box.min, max: box.max });
        }
    })

    useFrame(() => {
        if (playerRef && playerRef.current) {
            const playerPosition = playerRef.current.position

            if (playerPosition.x >= platformBounds.min.x && playerPosition.x <= platformBounds.max.x &&
                playerPosition.y >= platformBounds.min.y && playerPosition.y <= platformBounds.max.y &&
                playerPosition.z >= platformBounds.min.z && playerPosition.z <= platformBounds.max.z) {
                if (!isOnPlatform) {
                    setIsOnPlatform(true)
                }
            } else {
                if (isOnPlatform) {
                    setIsOnPlatform(false)
                }
            }
        }
    })

    return isOnPlatform
}
