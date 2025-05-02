'use client';

import React from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';

interface PreviewSceneProps {
  geometry: THREE.BufferGeometry;
}

function Scene({ geometry }: PreviewSceneProps) {
  const { camera } = useThree();

  return (
    <>
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#B8B8B8"
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
      <Grid infiniteGrid fadeDistance={20} fadeStrength={5} />
      <Environment preset="studio" />
    </>
  );
}

export default Scene; 