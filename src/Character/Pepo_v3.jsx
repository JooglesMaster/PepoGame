import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { MeshStandardMaterial } from 'three';
import { LoopOnce, LoopRepeat} from 'three'
import * as THREE from 'three'



export default function Pepo3({ props, mixer, actions,setDamping}) {
  const ref = useRef();
  const { nodes, materials, animations } = useGLTF('./models/pepo_v3.glb');

  useEffect(() => {
    if (animations && ref.current) {
      actions['dance'] = mixer.clipAction(animations[0], ref.current);
      actions['walk'] = mixer.clipAction(animations[3], ref.current);
      actions['idle'] = mixer.clipAction(animations[1], ref.current);
      actions['idle'].loop = LoopRepeat;
      actions['jump'] = mixer.clipAction(animations[2], ref.current);
      actions['jump'].loop = LoopOnce;
      actions['jump'].clampWhenFinished = true;
    }
  }, [animations, ref.current]);


  return (
    <group ref={ref} {...props} dispose={null}>
      <group name="Scene">
        <group name="Pepo" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh name="pepo" geometry={nodes.pepo.geometry} material={materials['Material.009']} skeleton={nodes.pepo.skeleton} castShadow/>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/pepo_v3.glb')
