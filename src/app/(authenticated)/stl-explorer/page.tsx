"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import ModelViewer from '@/components/ModelViewer';
import ModelPreview from '@/components/ModelPreview';
import { getAllModels, saveModel, deleteModel, clearAllModels } from '@/lib/storage';
import type { ModelData } from '@/lib/storage';

export default function STLExplorer() {
  const [models, setModels] = useState<ModelData[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Load models and select first one
  useEffect(() => {
    const loadModels = async () => {
      try {
        const storedModels = await getAllModels();
        setModels(storedModels);
        
        // If there are models, load the first one
        if (storedModels.length > 0) {
          const firstModel = storedModels[0];
          setSelectedModel(firstModel);
          
          // Load the geometry for the first model
          const base64Data = firstModel.base64.split(',')[1];
          const arrayBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)).buffer;
          const loader = new STLLoader();
          const geometry = loader.parse(arrayBuffer);
          geometry.computeBoundingSphere();
          setGeometry(geometry);
        }
      } catch (error) {
        console.error('Error loading initial models:', error);
      }
    };
    
    loadModels();
  }, []);

  const processFile = async (file: File) => {
    try {
      console.log('Processing file:', file.name);
      
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const loader = new STLLoader();
      const geometry = loader.parse(arrayBuffer);
      geometry.computeBoundingSphere();
      
      const modelData: ModelData = {
        id: Date.now().toString(),
        name: file.name,
        base64: `data:model/stl;base64,${base64}`,
        dimensions: {
          width: geometry.boundingSphere!.radius * 2,
          height: geometry.boundingSphere!.radius * 2,
          depth: geometry.boundingSphere!.radius * 2
        }
      };

      await saveModel(modelData);
      setModels(prevModels => [...prevModels, modelData]);
      setGeometry(geometry);
      setSelectedModel(modelData);
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const stlFiles = files.filter(file => file.name.toLowerCase().endsWith('.stl'));

    if (stlFiles.length > 0) {
      await processFile(stlFiles[0]);
    }
  }, []);

  const handleModelSelect = async (model: ModelData) => {
    try {
      console.log('Selecting model:', model.name);
      
      console.log('Model data:', {
        id: model.id,
        name: model.name,
        base64Length: model.base64.length
      });
      
      const base64Data = model.base64.split(',')[1];
      const arrayBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)).buffer;
      
      const loader = new STLLoader();
      const geometry = loader.parse(arrayBuffer);
      geometry.computeBoundingSphere();
      
      console.log('Geometry loaded:', {
        vertices: geometry.attributes.position.count,
        boundingSphere: geometry.boundingSphere
      });
      
      setGeometry(geometry);
      setSelectedModel(model);
    } catch (error) {
      console.error('Error selecting model:', error);
    }
  };

  const handleModelDelete = async (modelId: string) => {
    try {
      await deleteModel(modelId);
      setModels(prevModels => prevModels.filter(m => m.id !== modelId));
      if (selectedModel?.id === modelId) {
        setSelectedModel(null);
        setGeometry(null);
      }
    } catch (error) {
      console.error('Error deleting model:', error);
    }
  };

  // Update the upload button at the bottom
  const uploadButtonRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Main viewer */}
      <div className="flex-1 relative">
        {geometry ? (
          <ModelViewer geometry={geometry} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-white/50 mb-4">No model selected</p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".stl"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processFile(file);
                  }}
                />
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload STL
                </Button>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Gallery panel */}
      <div className={`border-l border-white/10 transition-all duration-300 flex flex-col ${
        isGalleryOpen ? 'w-72' : 'w-12'
      }`}>
        <div className="h-12 border-b border-white/10 flex items-center justify-between px-3 flex-shrink-0">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsGalleryOpen(!isGalleryOpen)}
            >
              {isGalleryOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
            {isGalleryOpen && <span className="ml-2">Models</span>}
          </div>
          {isGalleryOpen && models.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => clearAllModels().then(() => {
                setModels([]);
                setSelectedModel(null);
                setGeometry(null);
              })}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {isGalleryOpen && (
          <>
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-2 gap-3">
                {models.map(model => (
                  <ModelPreview
                    key={model.id}
                    model={model}
                    isSelected={selectedModel?.id === model.id}
                    onClick={() => handleModelSelect(model)}
                    onDelete={() => handleModelDelete(model.id)}
                  />
                ))}
              </div>
              {models.length === 0 && (
                <div className="text-center text-white/50 mt-8">
                  No models uploaded yet
                </div>
              )}
            </div>
            
            {/* Drag & Drop Zone */}
            <div
              className={`mx-3 mb-3 border-2 border-dashed rounded-lg transition-colors ${
                isDragging 
                  ? 'border-primary bg-primary/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="py-4 px-2 text-center">
                <p className="text-sm text-white/50">
                  Drag & drop STL file here
                </p>
              </div>
            </div>

            {/* Upload button */}
            <div className="p-3 border-t border-white/10">
              <input
                ref={uploadButtonRef}
                type="file"
                accept=".stl"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                }}
              />
              <button
                onClick={() => uploadButtonRef.current?.click()}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload STL
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 