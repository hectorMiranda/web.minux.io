import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface StorageItem {
  name: string;
  content: string;
  size: string;
}

interface FSNViewerProps {
  items: StorageItem[];
}

export function FSNViewer({ items }: FSNViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a192f);
    scene.fog = new THREE.Fog(0x0a192f, 20, 100);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(30, 40, 30);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI / 2;

    // Grid helper
    const gridHelper = new THREE.GridHelper(100, 50, 0x00ff88, 0x004422);
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const blockMap = new Map<THREE.Mesh, StorageItem>();

    // Create blocks for each storage item
    const blocks: THREE.Mesh[] = [];
    items.forEach((item, index) => {
      const size = parseInt(item.size) || 1;
      const height = Math.max(4, Math.log(size) * 2);
      
      const geometry = new THREE.BoxGeometry(2, height, 2);
      const material = new THREE.MeshPhongMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.6,
        emissive: 0x00ff88,
        emissiveIntensity: 0.2,
        shininess: 50,
      });
      
      const block = new THREE.Mesh(geometry, material);
      block.castShadow = true;
      block.receiveShadow = true;
      
      // Position blocks in a more spread out pattern
      const row = Math.floor(index / 5);
      const col = index % 5;
      const spacing = 8;
      block.position.x = (col - 2) * spacing;
      block.position.y = height / 2;
      block.position.z = (row - 2) * spacing;
      
      blocks.push(block);
      blockMap.set(block, item);
      scene.add(block);

      // Add text label with better visibility
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = 512;
        canvas.height = 128;
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#00FF88';
        context.font = 'bold 48px monospace';
        context.textAlign = 'center';
        context.fillText(item.name, canvas.width/2, canvas.height/2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
          map: texture,
          transparent: true,
          opacity: 0.8
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(block.position.x, block.position.y + height + 1, block.position.z);
        sprite.scale.set(4, 1, 1);
        scene.add(sprite);
      }
    });

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00ff88, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add volumetric light effect
    const volumetricLightGeometry = new THREE.CylinderGeometry(0, 3, 15, 32);
    const volumetricLightMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    const volumetricLight = new THREE.Mesh(volumetricLightGeometry, volumetricLightMaterial);
    volumetricLight.position.set(10, 10, 10);
    volumetricLight.rotation.x = Math.PI;
    scene.add(volumetricLight);

    // Click handler
    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(blocks);

      if (intersects.length > 0) {
        const clickedBlock = intersects[0].object as THREE.Mesh;
        const item = blockMap.get(clickedBlock);
        if (item) {
          setSelectedItem(item);
          // Highlight selected block
          blocks.forEach(block => {
            (block.material as THREE.MeshPhongMaterial).opacity = 0.6;
            (block.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.2;
          });
          (clickedBlock.material as THREE.MeshPhongMaterial).opacity = 1;
          (clickedBlock.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.5;
        }
      }
    };
    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      blocks.forEach((block, index) => {
        block.rotation.y += 0.005;
        const hoverOffset = Math.sin(Date.now() * 0.001 + index) * 0.1;
        block.position.y += hoverOffset;
      });
      
      volumetricLight.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      blocks.forEach(block => {
        block.geometry.dispose();
        (block.material as THREE.Material).dispose();
      });
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [items]);

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full h-[600px]" />
      {selectedItem && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-xl p-4 rounded-lg border border-primary/20">
          <h3 className="text-primary font-mono text-lg mb-2">{selectedItem.name}</h3>
          <p className="text-gray-400 font-mono text-sm overflow-auto max-h-32">
            {selectedItem.content}
          </p>
        </div>
      )}
    </div>
  );
} 