declare module '@react-three/fiber' {
  import { Camera, Scene, WebGLRenderer, WebGLRendererParameters } from 'three';
  import { ReactNode } from 'react';

  interface CanvasProps {
    children?: ReactNode;
    gl?: Partial<WebGLRenderer> & Partial<WebGLRendererParameters>;
    camera?: Partial<Camera>;
    scene?: Partial<Scene>;
    shadows?: boolean;
    dpr?: number | [number, number];
    flat?: boolean;
    linear?: boolean;
    legacy?: boolean;
    orthographic?: boolean;
    frameloop?: 'always' | 'demand' | 'never';
    performance?: { current: number; min: number; max: number; debounce: number };
    raycaster?: { 
      enabled: boolean; 
      computeOffsets?: (event: PointerEvent) => { offsetX: number; offsetY: number } 
    };
    style?: React.CSSProperties;
    className?: string;
    events?: {
      priority?: number;
      filter?: (intersections: Array<{ distance: number; object: THREE.Object3D }>) => boolean;
      compute?: (event: PointerEvent, root: HTMLElement) => { offsetX: number; offsetY: number };
    };
  }

  interface ThreeState {
    gl: WebGLRenderer;
    scene: Scene;
    camera: Camera;
    size: { width: number; height: number };
    viewport: { width: number; height: number; factor: number };
    pointer: { x: number; y: number };
    clock: { elapsedTime: number; delta: number };
  }

  export const Canvas: React.FC<CanvasProps>;
  export const useThree: () => ThreeState;
} 