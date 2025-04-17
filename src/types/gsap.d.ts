declare module 'gsap/dist/gsap' {
  export interface TweenVars {
    [key: string]: any;
  }

  export interface TweenConfig {
    duration?: number;
    delay?: number;
    ease?: string | Function;
    yoyo?: boolean;
    repeat?: number;
    onComplete?: Function;
    [key: string]: any;
  }

  export function to(target: any, vars: TweenVars, config?: TweenConfig): any;
  export function from(target: any, vars: TweenVars, config?: TweenConfig): any;
  export function fromTo(target: any, fromVars: TweenVars, toVars: TweenVars, config?: TweenConfig): any;
} 