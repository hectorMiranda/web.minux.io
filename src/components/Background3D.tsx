'use client';

import { useEffect, useRef, useMemo, Suspense, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion } from 'framer-motion';

// Fallback component when Three.js fails
function FallbackBackground() {
  return (
    <motion.div
      className="fixed inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {/* CSS-only animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/30 pointer-events-none" />
    </motion.div>
  );
}

// Simple particle system with error handling
function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const particleCount = 50; // Reduced for better performance

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      
      // Cyan color variations
      col[i * 3] = 0.1 + Math.random() * 0.3; // R
      col[i * 3 + 1] = 0.8 + Math.random() * 0.2; // G  
      col[i * 3 + 2] = 0.9 + Math.random() * 0.1; // B
    }
    
    return { positions: pos, colors: col };
  }, [particleCount]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    try {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i * 0.1) * 0.01;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    } catch (error) {
      console.warn('Particle animation error:', error);
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        vertexColors
      />
    </points>
  );
}

// Simplified geometric shapes
function FloatingGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  
  const objects = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    
    try {
      for (let i = 0; i < 6; i++) {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.5 + i * 0.1, 0.7, 0.5),
          wireframe: true,
          transparent: true,
          opacity: 0.1,
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );
        
        meshes.push(mesh);
      }
    } catch (error) {
      console.warn('Geometry creation error:', error);
    }
    
    return meshes;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    try {
      objects.forEach((mesh, i) => {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        mesh.position.y += Math.sin(state.clock.elapsedTime + i) * 0.01;
      });
      
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    } catch (error) {
      console.warn('Animation error:', error);
    }
  });

  return (
    <group ref={groupRef}>
      {objects.map((mesh, index) => (
        <primitive key={index} object={mesh} />
      ))}
    </group>
  );
}

// Simplified lighting
function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} color="#1e293b" />
      <pointLight
        position={[10, 10, 10]}
        intensity={0.5}
        color="#22d3ee"
        distance={30}
      />
      <pointLight
        position={[-10, -10, -10]}
        intensity={0.3}
        color="#3b82f6"
        distance={20}
      />
    </>
  );
}

// Error boundary component
function SafeScene() {
  try {
    return (
      <>
        <Lights />
        <Particles />
        <FloatingGeometry />
        <fog attach="fog" args={['#0f172a', 15, 80]} />
      </>
    );
  } catch (error) {
    console.warn('Scene render error:', error);
    return null;
  }
}

export function Background3D() {
  const [hasError, setHasError] = useState(false);

  // Error boundary for the Canvas
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      if (error.message?.includes('three') || error.message?.includes('fiber') || error.message?.includes('ReactCurrentOwner')) {
        console.warn('Three.js error detected, falling back to CSS animation');
        setHasError(true);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('three') || event.reason?.message?.includes('fiber')) {
        console.warn('Three.js promise rejection, falling back to CSS animation');
        setHasError(true);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return <FallbackBackground />;
  }

  return (
    <motion.div
      className="fixed inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <Suspense fallback={<FallbackBackground />}>
        <Canvas
          camera={{ 
            position: [0, 0, 15], 
            fov: 60,
            near: 0.1,
            far: 100 
          }}
          style={{ 
            background: 'transparent',
            pointerEvents: 'none'
          }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "default"
          }}
        >
          <SafeScene />
        </Canvas>
      </Suspense>
      
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/30 pointer-events-none" />
    </motion.div>
  );
} 