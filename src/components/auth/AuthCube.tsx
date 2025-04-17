import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap/dist/gsap';

interface AuthCubeProps {
  onCubeClick: () => void;
  isDialogOpen: boolean;
}

type Position = [number, number, number];
type Rotation = [number, number, number];

interface FacePosition {
  position: Position;
  rotation: Rotation;
}

export const AuthCube = ({ onCubeClick, isDialogOpen }: AuthCubeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isUnfolding, setIsUnfolding] = useState(false);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // If dialog is closed and we were unfolded, reverse the animation
    if (!isDialogOpen && isUnfolding) {
      if (animationRef.current) {
        animationRef.current.reverse();
        animationRef.current.eventCallback('onReverseComplete', () => {
          setIsUnfolding(false);
        });
      }
    }
  }, [isDialogOpen]);

  useEffect(() => {
    // If we already have a renderer, don't initialize again
    if (!containerRef.current || rendererRef.current) {
      return;
    }

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

    // Create cube faces
    const size = 2;
    const geometry = new THREE.BoxGeometry(size, size, size);
    
    // Create materials for each face with different colors
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x00FF88, transparent: true, opacity: 0.2 }), // right
      new THREE.MeshBasicMaterial({ color: 0x00FF88, transparent: true, opacity: 0.2 }), // left
      new THREE.MeshBasicMaterial({ color: 0x00FF88, transparent: true, opacity: 0.2 }), // top
      new THREE.MeshBasicMaterial({ color: 0x00FF88, transparent: true, opacity: 0.2 }), // bottom
      new THREE.MeshBasicMaterial({ color: 0x00FF88, transparent: true, opacity: 0.2 }), // front
      new THREE.MeshBasicMaterial({ color: 0x00FF88, transparent: true, opacity: 0.2 }), // back
    ];

    // Create individual faces for unfolding
    const faces: THREE.Mesh[] = [];
    const faceGeometry = new THREE.PlaneGeometry(size, size);
    
    // Create 6 faces with positions matching the cube
    const facePositions: FacePosition[] = [
      { position: [size/2, 0, 0] as Position, rotation: [0, Math.PI/2, 0] as Rotation }, // right
      { position: [-size/2, 0, 0] as Position, rotation: [0, -Math.PI/2, 0] as Rotation }, // left
      { position: [0, size/2, 0] as Position, rotation: [-Math.PI/2, 0, 0] as Rotation }, // top
      { position: [0, -size/2, 0] as Position, rotation: [Math.PI/2, 0, 0] as Rotation }, // bottom
      { position: [0, 0, size/2] as Position, rotation: [0, 0, 0] as Rotation }, // front
      { position: [0, 0, -size/2] as Position, rotation: [0, Math.PI, 0] as Rotation }, // back
    ];

    facePositions.forEach((faceData, index) => {
      const faceMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00FF88,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      const face = new THREE.Mesh(faceGeometry, faceMaterial);
      face.position.set(...faceData.position);
      face.rotation.set(...faceData.rotation);
      faces.push(face);
      scene.add(face);
      face.visible = false;
    });

    // Create wireframe cube
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

    // Animation states
    let isAnimating = false;
    let baseRotationX = 0;
    let baseRotationY = 0;

    const unfoldCube = () => {
      if (isAnimating) return;
      isAnimating = true;
      setIsUnfolding(true);

      // Store current rotation
      baseRotationX = cube.rotation.x;
      baseRotationY = cube.rotation.y;

      // Create a timeline for the animation
      const timeline = gsap.timeline({
        onComplete: () => {
          onCubeClick();
        },
        onReverseComplete: () => {
          cube.visible = true;
          wireframe.visible = true;
          faces.forEach(face => face.visible = false);
          isAnimating = false;
        }
      });

      // Add bounce animation
      timeline.to(cube.position, {
        y: 0.5,
        duration: 0.2,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          cube.visible = false;
          wireframe.visible = false;
          faces.forEach(face => face.visible = true);
        }
      });

      // Add unfolding animations
      faces.forEach((face, index) => {
        const targetPosition: Position = [...facePositions[index].position];

        switch(index) {
          case 0: // right
            targetPosition[0] += size;
            break;
          case 1: // left
            targetPosition[0] -= size;
            break;
          case 2: // top
            targetPosition[1] += size;
            break;
          case 3: // bottom
            targetPosition[1] -= size;
            break;
          case 4: // front
            targetPosition[2] += size;
            break;
          case 5: // back
            targetPosition[2] -= size;
            break;
        }

        timeline.to(face.position, {
          x: targetPosition[0],
          y: targetPosition[1],
          z: targetPosition[2],
          duration: 1,
          ease: "power2.inOut"
        }, ">-0.8");

        timeline.to(face.material, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.in"
        }, ">-0.5");
      });

      animationRef.current = timeline;
    };

    // Handle click events
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      if (isAnimating) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([cube, wireframe]);

      if (intersects.length > 0) {
        unfoldCube();
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop
    let frame: number;
    const animate = () => {
      frame = requestAnimationFrame(animate);

      if (!isUnfolding) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        wireframe.rotation.copy(cube.rotation);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.domElement.removeEventListener('click', handleClick);
        rendererRef.current = null;
      }
      if (containerRef.current?.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [onCubeClick, isUnfolding]);

  return (
    <div ref={containerRef} className="w-[300px] h-[300px]" style={{ isolation: 'isolate' }} />
  );
}; 