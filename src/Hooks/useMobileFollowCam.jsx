import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Object3D } from 'three';

export default function useMobileFollowCam() {
  const { scene, camera } = useThree();
  let previousTouchX = 0;
  let previousTouchY = 0;
  
  const pivot = useMemo(() => new Object3D(), []);
  const followCam = useMemo(() => {
    const o = new Object3D();
    o.position.set(0, 1, 2);
    return o;
  }, []);
  
  const targetRotationY = useRef(0);
  
  useFrame(() => {
    const lerpFactor = 0.1; // increased lerp factor
    pivot.rotation.y += (targetRotationY.current - pivot.rotation.y) * lerpFactor;
  });

  const onDocumentTouchMove = (e) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - previousTouchX;
    const deltaY = touch.clientY - previousTouchY;

    requestAnimationFrame(() => {
      const newRotationY = pivot.rotation.y - deltaX * 0.020; // increased multiplier for deltaX
      targetRotationY.current = newRotationY;

      const v = followCam.rotation.x - deltaY * 0.002;
      if (v >= -1.0 && v <= 0.4) {
        followCam.rotation.x = v;
        followCam.position.y = -v * followCam.position.z + 1;
      }
    });

    previousTouchX = touch.clientX;
    previousTouchY = touch.clientY;

    return false;
  };

  const onDocumentTouchStart = (e) => {
    const touch = e.touches[0];
    previousTouchX = touch.clientX;
    previousTouchY = touch.clientY;
    return false;
  };

  useEffect(() => {
    camera.position.set(0, 0, 0);
    followCam.add(camera);
    pivot.add(followCam);
    scene.add(pivot);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    return () => {
      document.removeEventListener('touchstart', onDocumentTouchStart);
      document.removeEventListener('touchmove', onDocumentTouchMove);
    };
  }, [camera, followCam, onDocumentTouchMove, onDocumentTouchStart, pivot, scene]);

  return { pivot };
}
