declare module '@react-three/fiber' {
  import { Camera, Scene, WebGLRenderer, WebGLRendererParameters, Vector3 } from 'three';
  import { ReactNode } from 'react';

  interface CameraProps {
    position?: Vector3 | [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
    zoom?: number;
  }

  interface CanvasProps {
    children?: ReactNode;
    gl?: Partial<WebGLRenderer> & Partial<WebGLRendererParameters>;
    camera?: Partial<Camera> | CameraProps;
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

  type RenderCallback = (state: ThreeState, delta: number) => void;

  export const Canvas: React.FC<CanvasProps>;
  export const useThree: () => ThreeState;
  export const useFrame: (callback: RenderCallback, renderPriority?: number) => void;
} 