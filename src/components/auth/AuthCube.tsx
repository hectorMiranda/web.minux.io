import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap/dist/gsap';

interface AuthCubeProps {
  onCubeClick: () => void;
  isDialogOpen: boolean;
}

export const AuthCube = ({ onCubeClick, isDialogOpen }: AuthCubeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    cube: THREE.Mesh;
    wireframe: THREE.LineSegments;
    animate: () => void;
  } | null>(null);

  // Initialize the scene
  useEffect(() => {
    if (!containerRef.current || rendererRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      preserveDrawingBuffer: false
    });
    
    rendererRef.current = renderer;
    renderer.setSize(300, 300);
    renderer.setClearColor(0x000000, 0);

    // Remove any existing canvas elements
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    
    containerRef.current.appendChild(renderer.domElement);

    // Create cube geometry and materials
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const materials = Array(6).fill(null).map(() => 
      new THREE.MeshBasicMaterial({ 
        color: 0x00FF88, 
        transparent: true, 
        opacity: 0.2 
      })
    );

    // Create wireframe
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00FF88,
      transparent: true,
      opacity: 0.8
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    
    // Create main cube
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    scene.add(wireframe);

    camera.position.z = 5;

    // Handle click with bounce animation
    const handleClick = (event: MouseEvent) => {
      event.preventDefault();
      if (isDialogOpen) return;
      
      // Quick bounce animation
      gsap.to(cube.position, {
        y: 0.5,
        duration: 0.2,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        onComplete: onCubeClick
      });
    };

    // Animation loop
    const animate = () => {
      if (!rendererRef.current) return;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    // Store scene objects for state updates
    sceneRef.current = {
      scene,
      cube,
      wireframe,
      animate
    };

    // Add event listeners
    renderer.domElement.addEventListener('click', handleClick);
    animate();

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.dispose();
      materials.forEach(material => material.dispose());
      geometry.dispose();
      edges.dispose();
      sceneRef.current = null;
      rendererRef.current = null;
    };
  }, []); // Only run once on mount

  // Handle dialog state changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const { cube, wireframe } = sceneRef.current;

    // Update rotation animation based on dialog state
    const updateRotation = () => {
      if (!isDialogOpen) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        wireframe.rotation.copy(cube.rotation);
      }
      requestAnimationFrame(updateRotation);
    };
    updateRotation();

    return () => {
      cube.rotation.set(0, 0, 0);
      wireframe.rotation.set(0, 0, 0);
    };
  }, [isDialogOpen]);

  return (
    <div 
      ref={containerRef} 
      style={{ width: '300px', height: '300px', cursor: isDialogOpen ? 'default' : 'pointer' }}
    />
  );
}; 