'use client';

import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeSceneProps {
  geometry: THREE.BufferGeometry;
}

function Scene({ geometry }: ThreeSceneProps) {
  const orbitControlsRef = useRef<any>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (geometry && orbitControlsRef.current) {
      geometry.center();
      geometry.computeBoundingSphere();
      const { radius, center } = geometry.boundingSphere!;
      
      const distance = (radius * 3.5) / Math.tan((camera.fov / 2) * Math.PI / 180);
      
      const controls = orbitControlsRef.current;
      controls.target.copy(center);
      camera.position.set(distance, distance, distance);
      controls.update();
    }
  }, [geometry, camera]);

  return (
    <>
      <OrbitControls 
        ref={orbitControlsRef}
        enableDamping 
        dampingFactor={0.05}
        makeDefault
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
      <Grid infiniteGrid fadeDistance={30} fadeStrength={5} />
      <Environment preset="studio" />
    </>
  );
}

export default Scene; 