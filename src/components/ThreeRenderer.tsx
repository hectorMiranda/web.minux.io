'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Toolbar from './Toolbar';

interface ThreeRendererProps {
  geometry: THREE.BufferGeometry;
  isPreview?: boolean;
}

type ViewMode = 'solid' | 'wireframe' | 'realistic' | 'xray';
type CameraView = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' | 'iso';

export default function ThreeRenderer({ geometry, isPreview = false }: ThreeRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('realistic');
  const [currentView, setCurrentView] = useState<CameraView>('iso');

  useEffect(() => {
    if (!containerRef.current || !geometry) return;

    let isMounted = true;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(5, 5, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    if (isPreview) {
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2;
    }
    controlsRef.current = controls;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(10, 10, 10);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-10, 5, -10);
    scene.add(fillLight);

    // Add mesh with material
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xcccccc,
      metalness: 0.2,
      roughness: 0.4,
      envMapIntensity: 1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Adjust camera position based on whether it's a preview or not
    geometry.computeBoundingSphere();
    const { radius } = geometry.boundingSphere!;
    const distance = isPreview 
      ? radius * 2.5 // Closer view for thumbnails
      : radius * 3.5; // Regular view for main display
    
    camera.position.set(distance, distance, distance);
    camera.lookAt(0, 0, 0);
    
    if (isPreview) {
      // For thumbnails, set a fixed rotation
      camera.position.set(distance, distance * 0.8, distance);
    }

    controls.target.set(0, 0, 0);
    controls.update();

    // Update animation loop with cleanup
    let animationFrameId: number;

    const animate = () => {
      if (!isMounted) return;
      animationFrameId = requestAnimationFrame(animate);
      if (controls) controls.update();
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    animate();

    // Cleanup
    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      if (renderer) {
        renderer.dispose();
        container.removeChild(renderer.domElement);
      }
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (controls) controls.dispose();
    };
  }, [geometry, isPreview]);

  // Handle view mode changes
  useEffect(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const material = mesh.material as THREE.Material;

    switch (viewMode) {
      case 'solid':
        mesh.material = new THREE.MeshStandardMaterial({
          color: 0xB8B8B8,
        });
        break;
      case 'wireframe':
        mesh.material = new THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          wireframe: true,
        });
        break;
      case 'realistic':
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: 0xB8B8B8,
          metalness: 0.8,
          roughness: 0.2,
        });
        break;
      case 'xray':
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: 0xB8B8B8,
          transparent: true,
          opacity: 0.5,
        });
        break;
    }

    material.dispose();
  }, [viewMode]);

  // Handle camera view changes
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current || !geometry.boundingSphere) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const { radius, center } = geometry.boundingSphere;
    const distance = (radius * 3.5) / Math.tan((camera.fov / 2) * Math.PI / 180);

    switch (currentView) {
      case 'front':
        camera.position.set(0, 0, distance);
        break;
      case 'back':
        camera.position.set(0, 0, -distance);
        break;
      case 'left':
        camera.position.set(-distance, 0, 0);
        break;
      case 'right':
        camera.position.set(distance, 0, 0);
        break;
      case 'top':
        camera.position.set(0, distance, 0);
        break;
      case 'bottom':
        camera.position.set(0, -distance, 0);
        break;
      case 'iso':
        camera.position.set(distance, distance, distance);
        break;
    }

    controls.target.copy(center);
    controls.update();
  }, [currentView, geometry]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {!isPreview && (
        <Toolbar
          viewMode={viewMode}
          setViewMode={setViewMode}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      )}
    </div>
  );
} 