import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

interface StorageItem {
  name: string;
  content: string;
  size: string;
}

interface FSNViewerProps {
  items: StorageItem[];
  onDelete: (itemName: string) => void;
  onUpdate: (itemName: string, newContent: string) => void;
}

export function FSNViewer({ items, onDelete, onUpdate }: FSNViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const blocksRef = useRef<THREE.Mesh[]>([]);
  const blockMapRef = useRef(new Map<THREE.Mesh, StorageItem>());

  // Add ESC key handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedItem(null);
        setIsEditing(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDelete = (item: StorageItem) => {
    // Find the mesh associated with this item
    const meshToDelete = Array.from(blockMapRef.current.entries())
      .find(([_, storageItem]) => storageItem === item)?.[0];

    if (meshToDelete) {
      // Animate the deletion
      gsap.to(meshToDelete.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          // Call the parent's onDelete handler
          onDelete(item.name);
          // Close the panel
          setSelectedItem(null);
          // Remove from scene
          meshToDelete.parent?.remove(meshToDelete);
          // Clean up
          (meshToDelete.material as THREE.Material).dispose();
          meshToDelete.geometry.dispose();
          blockMapRef.current.delete(meshToDelete);
        }
      });
    }
  };

  const handleEdit = (item: StorageItem) => {
    setIsEditing(true);
    setEditContent(item.content);
  };

  const handleSave = (item: StorageItem) => {
    onUpdate(item.name, editContent);
    setIsEditing(false);
    setSelectedItem({
      ...item,
      content: editContent,
      size: new Blob([editContent]).size.toString()
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a192f);
    scene.fog = new THREE.Fog(0x0a192f, 20, 100);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    
    // Clear any existing canvas
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 15;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2.5;
    controls.target.set(0, 2, 0);

    // Grid helper
    const gridHelper = new THREE.GridHelper(100, 50, 0x00ff88, 0x004422);
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    blockMapRef.current = new Map<THREE.Mesh, StorageItem>();

    // Create blocks for each storage item
    const blocks: THREE.Mesh[] = [];
    const ROWS = Math.ceil(Math.sqrt(items.length));
    const SPACING = 5;

    items.forEach((item, index) => {
      const width = 3;
      const height = 0.4;
      const depth = 2;
      
      // Create folder shape
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(width, 0);
      shape.lineTo(width, height);
      shape.lineTo(0, height);
      shape.lineTo(0, 0);

      const extrudeSettings = {
        steps: 1,
        depth: depth,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 1
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
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
      
      // Position blocks in a grid
      const row = Math.floor(index / ROWS);
      const col = index % ROWS;
      const offsetX = (ROWS * SPACING) / 2;
      const offsetZ = (ROWS * SPACING) / 2;
      
      block.position.x = (col * SPACING) - offsetX;
      block.position.y = 0;
      block.position.z = (row * SPACING) - offsetZ;
      
      blocks.push(block);
      blockMapRef.current.set(block, item);
      scene.add(block);

      // Add text label
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
        sprite.position.set(
          block.position.x,
          block.position.y + 1,
          block.position.z
        );
        sprite.scale.set(4, 1, 1);
        scene.add(sprite);
      }

      // Animate block appearance
      gsap.from(block.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        delay: index * 0.1,
        ease: "back.out(1.7)"
      });
    });

    blocksRef.current = blocks;

    // Click handler
    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(blocks);

      if (intersects.length > 0) {
        const clickedBlock = intersects[0].object as THREE.Mesh;
        const item = blockMapRef.current.get(clickedBlock);
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
      } else {
        // Click outside blocks - clear selection
        setSelectedItem(null);
        setIsEditing(false);
        // Reset all blocks appearance
        blocks.forEach(block => {
          (block.material as THREE.MeshPhongMaterial).opacity = 0.6;
          (block.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.2;
        });
      }
    };

    // Double click handler
    const handleDoubleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(blocks);

      if (intersects.length > 0) {
        const clickedBlock = intersects[0].object as THREE.Mesh;
        const item = blockMapRef.current.get(clickedBlock);
        if (item) {
          setSelectedItem(item);
          setIsEditing(true);
          setEditContent(item.content);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('dblclick', handleDoubleClick);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
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
      renderer.domElement.removeEventListener('dblclick', handleDoubleClick);
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
  }, [items, onDelete, onUpdate]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {selectedItem && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-[#0a192f] border border-primary rounded-lg overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-primary font-mono text-lg">{selectedItem.name}</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handleEdit(selectedItem)}
                className="text-primary hover:text-primary/80 transition-colors px-3 py-1 rounded bg-primary/20"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(selectedItem)}
                className="text-red-500 hover:text-red-400 transition-colors px-3 py-1 rounded bg-red-500/20"
              >
                Delete
              </button>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          {isEditing ? (
            <div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-32 bg-black/50 text-primary font-mono text-sm p-2 rounded border border-primary/20 focus:outline-none focus:border-primary/40"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors px-3 py-1 rounded bg-gray-500/20"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave(selectedItem)}
                  className="text-primary hover:text-primary/80 transition-colors px-3 py-1 rounded bg-primary/20"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 font-mono text-sm overflow-auto max-h-32">
              {selectedItem.content}
            </p>
          )}
        </div>
      )}
    </div>
  );
} 