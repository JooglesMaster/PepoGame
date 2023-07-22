import { Vector3 } from 'three';
import { useState } from 'react';
import { useFrame } from '@react-three/fiber';

export default function useZoneChecks(playerRef, canJump, zonePositions, zoneSizes) {
  const [isInZones, setIsInZones] = useState(Array(zonePositions.length).fill(false));

  useFrame(() => {
    const playerPosition = playerRef.current.position;

    zonePositions.forEach((zonePosition, index) => {
      const halfSize = new Vector3().copy(zoneSizes[index]).multiplyScalar(0.5);
      const minBounds = new Vector3().copy(zonePosition).sub(halfSize);
      const maxBounds = new Vector3().copy(zonePosition).add(halfSize);


      if (
        playerPosition.x >= minBounds.x && playerPosition.x <= maxBounds.x &&
        playerPosition.y >= minBounds.y && playerPosition.y <= maxBounds.y &&
        playerPosition.z >= minBounds.z && playerPosition.z <= maxBounds.z
      ) {
        if (!isInZones[index]) {
          setIsInZones(isInZones.map((val, i) => i === index ? true : val));
        }
      } else {
        if (isInZones[index]) {
          setIsInZones(isInZones.map((val, i) => i === index ? false : val));
        }
      }
    });
  });

  return isInZones;
}