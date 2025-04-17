declare module 'gsap/dist/gsap' {
  export interface TweenVars {
    [key: string]: number | string | boolean | object;
  }

  export interface TweenConfig {
    duration?: number;
    delay?: number;
    ease?: string | ((t: number) => number);
    yoyo?: boolean;
    repeat?: number;
    onComplete?: () => void;
    [key: string]: unknown;
  }

  export function to(target: object, vars: TweenVars, config?: TweenConfig): object;
  export function from(target: object, vars: TweenVars, config?: TweenConfig): object;
  export function fromTo(target: object, fromVars: TweenVars, toVars: TweenVars, config?: TweenConfig): object;
} 