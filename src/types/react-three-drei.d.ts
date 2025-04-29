declare module '@react-three/drei' {
  import { Camera, Vector3 } from 'three';
  import { ReactNode } from 'react';

  interface OrbitControlsProps {
    makeDefault?: boolean;
    camera?: Camera;
    domElement?: HTMLElement;
    enableDamping?: boolean;
    dampingFactor?: number;
    enableZoom?: boolean;
    enablePan?: boolean;
    enableRotate?: boolean;
    minPolarAngle?: number;
    maxPolarAngle?: number;
    minDistance?: number;
    maxDistance?: number;
    target?: Vector3 | [number, number, number];
    children?: ReactNode;
  }

  interface PerspectiveCameraProps {
    makeDefault?: boolean;
    position?: [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
    zoom?: number;
    children?: ReactNode;
    ref?: React.RefObject<THREE.PerspectiveCamera>;
  }

  export const OrbitControls: React.FC<OrbitControlsProps>;
  export const PerspectiveCamera: React.FC<PerspectiveCameraProps>;
} 