'use client';

import { useEffect, useRef, useMemo, Suspense, useState } from 'react';
import { motion } from 'framer-motion';

// Fallback component when Three.js fails
function FallbackBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -10,
        pointerEvents: 'none'
      }}
    >
      <motion.div
        className="w-full h-full"
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
                  pointerEvents: 'none'
                }}
              />
            ))}
          </div>
        </div>
        <div 
          className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/30"
          style={{ pointerEvents: 'none' }}
        />
      </motion.div>
    </div>
  );
}

// Dynamic import for Three.js components to avoid SSR issues
function ThreeBackground() {
  const [CanvasComponent, setCanvasComponent] = useState<any>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Dynamically import Three.js only on client side
    const loadThree = async () => {
      try {
        const THREE = await import('three');
        const { Canvas, useFrame } = await import('@react-three/fiber');
        
        // Simple floating cubes component
        function FloatingCubes() {
          const groupRef = useRef<any>(null);

          const cubes = useMemo(() => {
            const cubeArray = [];
            for (let i = 0; i < 8; i++) {
              cubeArray.push({
                position: [
                  (Math.random() - 0.5) * 20,
                  (Math.random() - 0.5) * 20,
                  (Math.random() - 0.5) * 20
                ],
                rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
                scale: 0.5 + Math.random() * 1,
                color: `hsl(${180 + Math.random() * 60}, 70%, 60%)`
              });
            }
            return cubeArray;
          }, []);

          useFrame((state) => {
            if (groupRef.current) {
              groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
              groupRef.current.children.forEach((child: any, i: number) => {
                child.rotation.x += 0.01 + (i * 0.001);
                child.rotation.y += 0.01 + (i * 0.001);
                child.position.y += Math.sin(state.clock.elapsedTime + i) * 0.01;
              });
            }
          });

          return (
            <group ref={groupRef}>
              {cubes.map((cube, i) => (
                <mesh key={i} position={cube.position as any} rotation={cube.rotation as any} scale={cube.scale}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicMaterial wireframe color={cube.color} transparent opacity={0.3} />
                </mesh>
              ))}
            </group>
          );
        }

        // Particle system
        function Particles() {
          const points = useRef<any>(null);
          const particleCount = 100;

          const positions = useMemo(() => {
            const pos = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount; i++) {
              pos[i * 3] = (Math.random() - 0.5) * 30;
              pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
              pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
            }
            return pos;
          }, []);

          useFrame((state) => {
            if (points.current) {
              points.current.rotation.y = state.clock.elapsedTime * 0.05;
              const positions = points.current.geometry.attributes.position.array;
              for (let i = 0; i < particleCount; i++) {
                positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i * 0.1) * 0.01;
              }
              points.current.geometry.attributes.position.needsUpdate = true;
            }
          });

          return (
            <points ref={points}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={particleCount}
                  array={positions}
                  itemSize={3}
                />
              </bufferGeometry>
              <pointsMaterial color="#22d3ee" size={0.1} transparent opacity={0.6} />
            </points>
          );
        }

        function Scene() {
          return (
            <>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={0.5} color="#22d3ee" />
              <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />
              <FloatingCubes />
              <Particles />
              <fog attach="fog" args={['#0f172a', 15, 80]} />
            </>
          );
        }

        // Return the Canvas component
        const CanvasEl = () => (
          <div 
            className="three-canvas-background"
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: -10,
              pointerEvents: 'none',
              touchAction: 'none'
            }}
          >
            <Canvas
              camera={{ position: [0, 0, 15], fov: 60 }}
              style={{ 
                width: '100%',
                height: '100%',
                background: 'transparent',
                pointerEvents: 'none',
                touchAction: 'none'
              }}
              gl={{ 
                antialias: false, 
                alpha: true,
                preserveDrawingBuffer: false,
                powerPreference: 'high-performance'
              }}
              events={{
                // Disable all pointer events
                priority: -1,
                filter: () => false
              }}
            >
              <Scene />
            </Canvas>
          </div>
        );

        setCanvasComponent(() => CanvasEl);
      } catch (error) {
        console.warn('Failed to load Three.js, using fallback:', error);
        setHasError(true);
      }
    };

    // Only load on client side
    if (typeof window !== 'undefined') {
      loadThree();
    }
  }, []);

  if (hasError || !CanvasComponent) {
    return <FallbackBackground />;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -10,
        pointerEvents: 'none'
      }}
    >
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <CanvasComponent />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/30"
          style={{ pointerEvents: 'none' }}
        />
      </motion.div>
    </div>
  );
}

export function Background3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <FallbackBackground />;
  }

  return (
    <Suspense fallback={<FallbackBackground />}>
      <ThreeBackground />
    </Suspense>
  );
} 