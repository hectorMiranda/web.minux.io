export interface Project {
  title: string;
  description: string;
  repo: string;
  image?: string;
}

export interface MinuxConfig {
  siteTitle: string;
  subtitle: string;
  themeColor: string;
  projects: Project[];
  social: {
    github?: string;
    twitter?: string;
    email?: string;
  };
}

export const config: MinuxConfig = {
  siteTitle: "Minux",
  subtitle: "A modular OS for Machines",
  themeColor: "#00FF88",
  projects: [
    {
      title: "robotics.minux.io",
      description: "AI-powered delivery bot using RPi 5",
      repo: "https://github.com/hectorMiranda/robotics.minux.io"
    },
    {
      title: "crypto.minux.io",
      description: "Wallet commands, keygen, and AES tools",
      repo: "https://github.com/hectorMiranda"
    }
  ],
  social: {
    github: "https://github.com/hectorMiranda",
    email: "contact@minux.io"
  }
}; 