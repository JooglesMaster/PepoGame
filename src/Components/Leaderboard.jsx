import { Html, Text } from '@react-three/drei';
import React from 'react';
import * as THREE from 'three';

function Leaderboard({ highScores }) {
  const sortedHighScores = [...highScores].sort((a, b) => a.score - b.score); // Sort in ascending order

  return (
    <group rotation={[0, 90 * Math.PI / 180, 0]} position={[-2.5, 0, 1]}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2.5, 3, 0.2]} />
        <meshBasicMaterial color={0xffffff} />
      </mesh>
      {sortedHighScores.map((score, index) => (
        <Text
          key={index}
          color="black"
          anchorX="left"
          anchorY="left"
          maxWidth={80}
          lineHeight={1}
          position={[-1.2, 2.9 - index * 0.2, 0.2]} // Adjust y-position based on index
          fontSize={0.19}
        >
          {`${index + 1}. ${score.name}: ${score.score} secs`}
        </Text>
      ))}
    </group>
  );
}

export default Leaderboard;
