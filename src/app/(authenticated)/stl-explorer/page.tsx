"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid } from "@react-three/drei";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Upload, 
  GripHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown
} from "lucide-react";

interface ModelData {
  id: string;
  name: string;
  base64: string;
  dimensions: {
    x: number;
    y: number;
    z: number;
  };
}

// Add new types for panel positions
type PanelPosition = 'left' | 'right' | 'bottom' | 'none';

// Add these types for isometric views
type IsometricView = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' | 'iso';

function ModelViewer({ geometry }: { geometry: THREE.BufferGeometry }) {
  const orbitControlsRef = useRef<any>(null);
  const [currentView, setCurrentView] = useState<IsometricView>('iso');

  useEffect(() => {
    if (geometry && orbitControlsRef.current) {
      geometry.computeBoundingSphere();
      const { radius, center } = geometry.boundingSphere!;
      
      // Calculate camera distance to fit the entire model
      const fov = 45;
      const distance = (radius * 3.5) / Math.tan((fov / 2) * Math.PI / 180);
      
      // Update camera and controls target
      const controls = orbitControlsRef.current;
      controls.target.copy(center);
      
      // Set camera position based on view
      const cameraPosition = new THREE.Vector3();
      switch (currentView) {
        case 'front':
          cameraPosition.set(0, 0, distance);
          break;
        case 'back':
          cameraPosition.set(0, 0, -distance);
          break;
        case 'left':
          cameraPosition.set(-distance, 0, 0);
          break;
        case 'right':
          cameraPosition.set(distance, 0, 0);
          break;
        case 'top':
          cameraPosition.set(0, distance, 0);
          break;
        case 'bottom':
          cameraPosition.set(0, -distance, 0);
          break;
        case 'iso':
          cameraPosition.set(distance, distance, distance);
          break;
      }
      
      // Add center offset to camera position
      cameraPosition.add(center);
      controls.object.position.copy(cameraPosition);
      controls.update();
    }
  }, [geometry, currentView]);

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ fov: 45 }}>
        <OrbitControls 
          ref={orbitControlsRef}
          enableDamping 
          dampingFactor={0.05}
          makeDefault
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh geometry={geometry}>
          <meshStandardMaterial color="#B8B8B8" roughness={0.5} metalness={0.5} />
        </mesh>
        <Grid infiniteGrid fadeDistance={30} fadeStrength={5} />
      </Canvas>
      
      {/* View Controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 bg-[#2D2D2D] rounded-lg border border-white/10 p-2">
        <ViewButton
          view="iso"
          currentView={currentView}
          onClick={() => setCurrentView('iso')}
          icon={<div className="w-5 h-5 flex items-center justify-center">ISO</div>}
        />
        <ViewButton
          view="front"
          currentView={currentView}
          onClick={() => setCurrentView('front')}
          icon={<ArrowUp className="w-5 h-5" />}
        />
        <ViewButton
          view="back"
          currentView={currentView}
          onClick={() => setCurrentView('back')}
          icon={<ArrowDown className="w-5 h-5" />}
        />
        <ViewButton
          view="left"
          currentView={currentView}
          onClick={() => setCurrentView('left')}
          icon={<ArrowLeft className="w-5 h-5" />}
        />
        <ViewButton
          view="right"
          currentView={currentView}
          onClick={() => setCurrentView('right')}
          icon={<ArrowRight className="w-5 h-5" />}
        />
        <ViewButton
          view="top"
          currentView={currentView}
          onClick={() => setCurrentView('top')}
          icon={<div className="w-5 h-5 flex items-center justify-center">⊙</div>}
        />
        <ViewButton
          view="bottom"
          currentView={currentView}
          onClick={() => setCurrentView('bottom')}
          icon={<div className="w-5 h-5 flex items-center justify-center">⊗</div>}
        />
      </div>
    </div>
  );
}

// Add this new component for view buttons
function ViewButton({ 
  view, 
  currentView, 
  onClick, 
  icon 
}: { 
  view: IsometricView;
  currentView: IsometricView;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-md transition-colors ${
        currentView === view 
          ? 'bg-primary/20 text-primary' 
          : 'text-white/50 hover:bg-white/5 hover:text-white'
      }`}
      title={view.charAt(0).toUpperCase() + view.slice(1)}
    >
      {icon}
    </button>
  );
}

function ModelPreview({ 
  model, 
  isSelected,
  onClick, 
  onDelete 
}: { 
  model: ModelData;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const orbitControlsRef = useRef<any>(null);

  useEffect(() => {
    const loader = new STLLoader();
    const arrayBuffer = Uint8Array.from(atob(model.base64.split(',')[1]), c => c.charCodeAt(0)).buffer;
    const geometry = loader.parse(arrayBuffer);
    geometry.center();
    geometry.computeBoundingSphere();
    setGeometry(geometry);
  }, [model.base64]);

  useEffect(() => {
    if (geometry && orbitControlsRef.current) {
      const { radius, center } = geometry.boundingSphere!;
      const distance = (radius * 3.5) / Math.tan((45 / 2) * Math.PI / 180);
      const controls = orbitControlsRef.current;
      controls.target.copy(center);
      controls.object.position.set(distance, distance, distance);
      controls.update();
    }
  }, [geometry]);

  if (!geometry) return null;

  return (
    <div className="relative group">
      <div 
        className={`aspect-square border rounded-lg overflow-hidden cursor-pointer transition-colors ${
          isSelected 
            ? 'border-primary' 
            : 'border-white/10 hover:border-primary/50'
        }`}
        onClick={onClick}
      >
        <Canvas camera={{ fov: 45 }}>
          <OrbitControls
            ref={orbitControlsRef}
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <mesh geometry={geometry}>
            <meshStandardMaterial color="#B8B8B8" roughness={0.5} metalness={0.5} />
          </mesh>
          <Grid infiniteGrid fadeDistance={20} fadeStrength={5} />
        </Canvas>
      </div>
      <div className="absolute inset-0 flex items-end justify-between p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs font-medium truncate text-white">{model.name}</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-500 hover:text-red-400"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function STLExplorer() {
  const [models, setModels] = useState<ModelData[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);
  const [selectedGeometry, setSelectedGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(true);
  const [gallerySize, setGallerySize] = useState(300); // Width or height depending on position
  const [galleryPosition, setGalleryPosition] = useState<PanelPosition>('bottom');
  const [uploadPanelPosition, setUploadPanelPosition] = useState<PanelPosition>('left');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const savedModels = localStorage.getItem('stl-models');
    if (savedModels) {
      const parsed = JSON.parse(savedModels);
      setModels(parsed);
      if (parsed.length > 0) {
        setSelectedModel(parsed[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedModel) {
      const loader = new STLLoader();
      const arrayBuffer = Uint8Array.from(atob(selectedModel.base64.split(',')[1]), c => c.charCodeAt(0)).buffer;
      const geometry = loader.parse(arrayBuffer);
      geometry.center();
      geometry.computeBoundingSphere();
      setSelectedGeometry(geometry);
    } else {
      setSelectedGeometry(null);
    }
  }, [selectedModel]);

  const saveModels = useCallback((newModels: ModelData[]) => {
    localStorage.setItem('stl-models', JSON.stringify(newModels));
    setModels(newModels);
  }, []);

  const processFile = useCallback(async (file: File) => {
    const reader = new FileReader();
    
    return new Promise<ModelData>((resolve, reject) => {
      reader.onload = async (event) => {
        try {
          const base64 = event.target?.result as string;
          const loader = new STLLoader();
          const arrayBuffer = Uint8Array.from(atob(base64.split(',')[1]), c => c.charCodeAt(0)).buffer;
          const geometry = loader.parse(arrayBuffer);
          geometry.computeBoundingBox();
          const box = geometry.boundingBox!;
          
          const dimensions = {
            x: Math.abs(box.max.x - box.min.x),
            y: Math.abs(box.max.y - box.min.y),
            z: Math.abs(box.max.z - box.min.z),
          };

          resolve({
            id: `${file.name}-${Date.now()}`,
            name: file.name,
            base64,
            dimensions,
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFiles = useCallback(async (files: FileList) => {
    const newModels: ModelData[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name.toLowerCase().endsWith('.stl')) {
        try {
          const model = await processFile(file);
          newModels.push(model);
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
        }
      }
    }

    if (newModels.length > 0) {
      const updatedModels = [...models, ...newModels];
      saveModels(updatedModels);
      if (!selectedModel) {
        setSelectedModel(newModels[0]);
      }
    }
  }, [models, saveModels, selectedModel]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const deleteModel = useCallback((modelId: string) => {
    const newModels = models.filter(m => m.id !== modelId);
    saveModels(newModels);
    if (selectedModel?.id === modelId) {
      setSelectedModel(newModels[0] || null);
    }
  }, [models, selectedModel, saveModels]);

  const clearAll = useCallback(() => {
    localStorage.removeItem('stl-models');
    setModels([]);
    setSelectedModel(null);
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleResize = useCallback((e: MouseEvent) => {
    if (isDraggingRef.current && resizeRef.current) {
      const container = resizeRef.current.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      let newSize;

      switch (galleryPosition) {
        case 'left':
        case 'right':
          newSize = galleryPosition === 'left' 
            ? e.clientX - containerRect.left 
            : containerRect.right - e.clientX;
          setGallerySize(Math.min(Math.max(newSize, 200), window.innerWidth * 0.4));
          break;
        case 'bottom':
          newSize = containerRect.bottom - e.clientY;
          setGallerySize(Math.min(Math.max(newSize, 150), window.innerHeight * 0.4));
          break;
      }
    }
  }, [galleryPosition]);

  // Position toggle buttons
  const PositionToggle = ({ position }: { position: PanelPosition }) => (
    <button
      onClick={() => setGalleryPosition(position)}
      className={`p-1 rounded ${galleryPosition === position ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}
    >
      {position === 'left' && <ArrowLeft className="w-4 h-4" />}
      {position === 'right' && <ArrowRight className="w-4 h-4" />}
      {position === 'bottom' && <ArrowDown className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="flex h-screen">
      {/* Upload Panel */}
      <div 
        className={`shrink-0 bg-[#2D2D2D] border-r border-white/10 ${
          uploadPanelPosition === 'left' ? 'w-64' : 'hidden'
        }`}
      >
        <div className="p-3">
          <div 
            ref={dropZoneRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-white/10 rounded-lg hover:border-white/20 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".stl"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
            <Upload className="w-8 h-8 text-white/30" />
            <span className="text-sm text-white/50 text-center">
              Drop STL files here or click to upload
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Model Viewer */}
        <div className="absolute inset-0">
          {selectedModel && selectedGeometry ? (
            <ModelViewer geometry={selectedGeometry} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30">
              No model selected
            </div>
          )}
        </div>

        {/* Models Panel */}
        {models.length > 0 && (
          <div 
            className={`absolute bg-[#2D2D2D] border-white/10 ${
              galleryPosition === 'left' ? 'left-0 top-0 bottom-0 border-r' :
              galleryPosition === 'right' ? 'right-0 top-0 bottom-0 border-l' :
              'left-0 right-0 bottom-0 border-t'
            }`}
            style={{
              [galleryPosition === 'bottom' ? 'height' : 'width']: isGalleryOpen ? `${gallerySize}px` : '32px',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {/* Header with position controls */}
            <div className="flex items-center justify-between p-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Models ({models.length})</span>
                <button
                  onClick={() => setIsGalleryOpen(!isGalleryOpen)}
                  className="p-1 hover:bg-white/5 rounded"
                >
                  {isGalleryOpen ? (
                    galleryPosition === 'bottom' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                  ) : (
                    galleryPosition === 'bottom' ? <ChevronUp className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-1">
                <PositionToggle position="left" />
                <PositionToggle position="right" />
                <PositionToggle position="bottom" />
              </div>
            </div>

            {/* Resize Handle */}
            {isGalleryOpen && (
              <div
                ref={resizeRef}
                onMouseDown={() => {
                  isDraggingRef.current = true;
                  document.body.style.cursor = galleryPosition === 'bottom' ? 'row-resize' : 'col-resize';
                }}
                className={`absolute z-10 ${
                  galleryPosition === 'left' ? '-right-1 top-0 bottom-0 w-2 cursor-col-resize' :
                  galleryPosition === 'right' ? '-left-1 top-0 bottom-0 w-2 cursor-col-resize' :
                  'left-0 right-0 -top-1 h-2 cursor-row-resize'
                } hover:bg-white/5`}
              >
                <div className="flex items-center justify-center h-full">
                  <GripHorizontal className="w-4 h-4 text-white/30" />
                </div>
              </div>
            )}

            {/* Gallery Grid */}
            {isGalleryOpen && (
              <div className="overflow-auto p-3" style={{ 
                height: galleryPosition === 'bottom' ? `calc(${gallerySize}px - 40px)` : 'calc(100% - 40px)',
                width: '100%'
              }}>
                <div className={`grid gap-3 ${
                  galleryPosition === 'bottom' 
                    ? 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8' 
                    : 'grid-cols-1 sm:grid-cols-2'
                }`}>
                  {models.map((model) => (
                    <ModelPreview
                      key={model.id}
                      model={model}
                      isSelected={selectedModel?.id === model.id}
                      onClick={() => setSelectedModel(model)}
                      onDelete={() => {
                        deleteModel(model.id);
                        if (selectedModel?.id === model.id) {
                          setSelectedModel(null);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 