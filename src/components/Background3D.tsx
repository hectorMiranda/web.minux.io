'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';

function Scene() {
  const objects = useRef<THREE.Mesh[]>([]);
  
  useEffect(() => {
    // Create geometric objects
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.OctahedronGeometry(0.8),
      new THREE.TorusGeometry(0.5, 0.2, 16, 100)
    ];

    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff88,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });

    // Initialize objects array with 15 meshes
    objects.current = Array(15).fill(null).map(() => {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      return new THREE.Mesh(geometry, material.clone());
    });

    // Set initial positions and rotations
    objects.current.forEach(object => {
      object.position.set(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 15
      );
      
      object.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
    });

    // Cleanup
    return () => {
      objects.current.forEach(obj => {
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
      });
    };
  }, []);

  useFrame(() => {
    objects.current.forEach((obj, i) => {
      obj.rotation.x += 0.001 + (i * 0.0002);
      obj.rotation.y += 0.002 + (i * 0.0001);
      obj.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
    });
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color={0x00ff88} />
      {objects.current.map((object, index) => (
        <primitive key={index} object={object} />
      ))}
    </>
  );
}

export function Background3D() {
  return (
    <motion.div
      className="fixed inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </motion.div>
  );
} 