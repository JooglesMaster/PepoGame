

export default function Zone(props) {


  return (
    <mesh  position={props.position}>
      <boxBufferGeometry attach="geometry" args={props.size} />
      <meshBasicMaterial attach="material" transparent opacity={0.5} /> {/* Set transparency to visualize the zone */}
    </mesh>
  )
}
