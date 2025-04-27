import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { Database, Trash2, Edit2, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Rnd } from 'react-rnd';

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

// Add this CSS class to your global styles or a local CSS module
const marqueeStyles = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }
  .marquee-container {
    overflow: hidden;
    white-space: nowrap;
    max-width: 200px;
  }
  .marquee-text {
    display: inline-block;
    animation: marquee 10s linear infinite;
  }
  .marquee-text:hover {
    animation-play-state: paused;
  }
`;

// Add this CSS at the top of your component or in a separate CSS file
const scrollingTextStyles = `
  .text-container {
    max-width: 200px;
    overflow: hidden;
    position: relative;
  }

  .text-content {
    white-space: nowrap;
    display: inline-block;
    transition: transform 0.3s;
  }

  .text-content.scrolling {
    animation: scrollText 15s linear infinite;
  }

  .text-content.scrolling:hover {
    animation-play-state: paused;
  }

  @keyframes scrollText {
    0%, 10% {
      transform: translateX(0);
    }
    90%, 100% {
      transform: translateX(calc(-100% + 200px)); /* Adjust based on container width */
    }
  }
`;

// Add this function to check text overflow
function useCheckTextOverflow(text: string) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const element = textRef.current;
        setIsOverflowing(element.scrollWidth > element.clientWidth);
      }
    };

    checkOverflow();
    // Add resize observer to check on container size changes
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [text]);

  return { textRef, isOverflowing };
}

// In your component:
const TextWithScroll = ({ text }: { text: string }) => {
  const { textRef, isOverflowing } = useCheckTextOverflow(text);
  
  return (
    <div className="text-container">
      <div 
        ref={textRef}
        className={`text-content font-mono text-primary ${isOverflowing ? 'scrolling' : ''}`}
        title={text} // Add tooltip for full text
      >
        {text}
      </div>
    </div>
  );
};

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
        <Rnd
          default={{
            x: 20,
            y: 20,
            width: 380,
            height: 500
          }}
          minWidth={300}
          minHeight={200}
          bounds="window"
          dragHandleClassName="panel-handle"
        >
          <div className="w-full h-full bg-[#0A192F] rounded-lg border border-primary/20 shadow-xl flex flex-col">
            <div className="panel-handle cursor-move flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-primary/20">
              <style>{scrollingTextStyles}</style>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Database className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <TextWithScroll text={selectedItem.name} />
                  <div className="text-xs text-gray-400 truncate">{selectedItem.size} bytes</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!isEditing && (
                  <button
                    onClick={() => handleEdit(selectedItem)}
                    className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {isEditing && (
                  <button
                    onClick={() => handleSave(selectedItem)}
                    className="text-green-400 hover:text-green-300 transition-colors p-2 hover:bg-green-400/10 rounded-lg"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedItem)}
                  className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-300 transition-colors p-2 hover:bg-gray-400/10 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-full px-3 py-2 rounded-md bg-black/20 border border-primary/20 focus:outline-none focus:border-primary font-mono resize-none"
                />
              ) : (
                <pre className="whitespace-pre-wrap break-all text-white/70 font-mono">
                  {selectedItem.content}
                </pre>
              )}
            </div>
          </div>
        </Rnd>
      )}
    </div>
  );
} 