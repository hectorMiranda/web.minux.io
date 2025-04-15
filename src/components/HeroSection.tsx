'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [accessText, setAccessText] = useState('');

  const handleCubeClick = useCallback(() => {
    setShowInput(true);
  }, []);

  useEffect(() => {
    if (showInput) {
      const text = "MINUX SYSTEM ACCESS";
      let index = 0;
      const intervalId = setInterval(() => {
        if (index <= text.length) {
          setAccessText(text.slice(0, index));
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 100);
      return () => clearInterval(intervalId);
    }
  }, [showInput]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Create cube with separate materials for each face
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const materials = Array(6).fill(null).map(() => 
      new THREE.MeshPhongMaterial({
        color: 0x00ff88,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      })
    );
    
    const cube = new THREE.Mesh(geometry, materials);
    cubeRef.current = cube;
    scene.add(cube);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ff88, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;

    // Make cube interactive
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredFaceIndex = -1;

    const resetMaterials = () => {
      materials.forEach(material => {
        material.opacity = 0.8;
        material.wireframe = true;
      });
    };

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(cube);

      if (intersects.length > 0) {
        const faceIndex = Math.floor(intersects[0].faceIndex! / 2);
        
        if (hoveredFaceIndex !== faceIndex) {
          resetMaterials();
          hoveredFaceIndex = faceIndex;
          document.body.style.cursor = 'pointer';
          (cube.material as THREE.MeshPhongMaterial[])[faceIndex].opacity = 1;
        }
      } else {
        if (hoveredFaceIndex !== -1) {
          resetMaterials();
          hoveredFaceIndex = -1;
          document.body.style.cursor = 'default';
        }
      }
    };

    const onClick = (event: MouseEvent) => {
      event.preventDefault();
      
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(cube);

      if (intersects.length > 0) {
        const faceIndex = Math.floor(intersects[0].faceIndex! / 2);
        // Highlight clicked face
        resetMaterials();
        const material = (cube.material as THREE.MeshPhongMaterial[])[faceIndex];
        material.opacity = 1;
        material.wireframe = false;
        handleCubeClick();
      }
    };

    // Animation
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (cubeRef.current) {
        cubeRef.current.rotation.x += 0.005;
        cubeRef.current.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);
    
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      cancelAnimationFrame(animationFrameId);
      materials.forEach(material => material.dispose());
      geometry.dispose();
      renderer.dispose();
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [handleCubeClick]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.toLowerCase() === 'minux') {
      window.location.href = '/dashboard';
    } else {
      setError('ACCESS DENIED');
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      <div ref={containerRef} className="absolute inset-0" />
      
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80"
          >
            {/* Grid lines background */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-px bg-primary"
                  style={{ top: `${i * 2}%` }}
                />
              ))}
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-px h-full bg-primary"
                  style={{ left: `${i * 2}%` }}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-4xl mx-4 aspect-video bg-black border-2 border-primary rounded-lg overflow-hidden"
            >
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-primary" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-primary" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-primary" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-primary" />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-primary font-mono text-2xl md:text-4xl mb-8 tracking-wider"
                >
                  {accessText}
                </motion.h1>

                <motion.form
                  onSubmit={handleSubmit}
                  className="w-full max-w-lg flex flex-col items-center"
                >
                  <div className="w-full h-16 md:h-20 relative">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="ENTER ACCESS CODE"
                      className="w-full h-full bg-black border-2 border-primary px-4 text-center text-primary font-mono text-xl md:text-3xl tracking-widest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-primary/50"
                      autoFocus
                    />
                    {/* Scan line effect */}
                    <motion.div
                      className="absolute inset-0 bg-primary/10"
                      animate={{
                        top: ["0%", "100%", "0%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 font-mono text-xl md:text-2xl mt-4 tracking-wider"
                    >
                      {error}
                    </motion.p>
                  )}
                </motion.form>
              </div>

              {/* Decorative scanning lines */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
                animate={{
                  y: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 