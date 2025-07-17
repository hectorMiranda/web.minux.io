This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 20 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or your preferred package manager (yarn, pnpm, or bun)
- **Git** - [Download from git-scm.com](https://git-scm.com/)

You can verify your installations by running:
```bash
node --version
npm --version
git --version
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web.minux.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables (if needed)**
   - Copy `.env.example` to `.env.local` if it exists
   - Configure any required environment variables

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Available Scripts

In the project directory, you can run:

- `npm run dev` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run start` - Runs the built app in production mode
- `npm run lint` - Runs ESLint to check for code issues
- `npm run lint:strict` - Runs strict ESLint checks
- `npm run check` - Runs TypeScript type checking and linting

## Project Structure

This project includes several advanced features:

- **3D Graphics**: Built with Three.js and React Three Fiber
- **MIDI Support**: Interactive MIDI keyboard and Mozart piece player
- **Dashboard System**: System monitoring and management interface
- **API Documentation**: Swagger/OpenAPI documentation
- **Authentication**: Secure access to authenticated routes
- **File Management**: STL file explorer and storage management

## Troubleshooting

**Common Issues:**

1. **Port already in use**: If port 3000 is busy, Next.js will automatically use the next available port
2. **Node version issues**: Make sure you're using Node.js 20+ (check with `node --version`)
3. **Package installation fails**: Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
4. **Build errors**: Run `npm run check` to see TypeScript and linting issues

**Performance Tips:**
- For better 3D performance, ensure hardware acceleration is enabled in your browser
- The MIDI features require a compatible MIDI device or software synthesizer

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
