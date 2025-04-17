import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap/dist/gsap';

interface LoadingCubesProps {
  onFinish: () => void;
}

export const LoadingCubes = ({ onFinish }: LoadingCubesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0B1120, 1);
    containerRef.current.appendChild(renderer.domElement);

    // Create cube geometry and materials
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00FF88,
      transparent: true,
      opacity: 0.2
    });
    const edgesMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00FF88,
      transparent: true,
      opacity: 0.8
    });

    // Create random positions for 20 cubes
    const numCubes = 20;
    const cubes: THREE.Group[] = [];
    const randomRange = 15;

    for (let i = 0; i < numCubes; i++) {
      const group = new THREE.Group();
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial.clone());
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(cubeGeometry),
        edgesMaterial.clone()
      );

      group.add(cube);
      group.add(edges);
      
      // Random position within a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = Math.random() * randomRange;
      
      group.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      
      // Random rotation
      group.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      // Random scale
      const scale = 0.3 + Math.random() * 0.7;
      group.scale.set(scale, scale, scale);
      
      scene.add(group);
      cubes.push(group);
    }

    camera.position.z = 20;

    // Animate cubes appearing and then converging
    cubes.forEach((cube, index) => {
      // First appear with scale animation
      gsap.from(cube.scale, {
        x: 0.001,
        y: 0.001,
        z: 0.001,
        duration: 0.5,
        delay: index * 0.1,
        ease: "back.out(1.7)"
      });

      // Then after all cubes appear, converge to center
      gsap.to(cube.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        delay: numCubes * 0.1 + 1,
        ease: "power2.inOut"
      });

      gsap.to(cube.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        delay: numCubes * 0.1 + 1,
        ease: "power2.inOut"
      });

      gsap.to(cube.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        delay: numCubes * 0.1 + 1.5,
        ease: "power2.in",
        onComplete: index === 0 ? onFinish : undefined
      });
    });

    // Continuous rotation animation
    const animate = () => {
      requestAnimationFrame(animate);
      cubes.forEach(cube => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      });
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      cubeGeometry.dispose();
      cubeMaterial.dispose();
      edgesMaterial.dispose();
      cubes.forEach(group => {
        group.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
      });
    };
  }, [onFinish]);

  return <div ref={containerRef} className="fixed inset-0" />;
}; 