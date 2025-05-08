import { NextResponse } from 'next/server';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

async function getCpuUsage() {
  // Get CPU usage on Linux/Unix systems
  try {
    const { stdout } = await execAsync("top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'");
    return parseFloat(stdout);
  } catch {
    // Fallback: calculate based on CPU times
    const startMeasure = os.cpus().map(cpu => ({
      idle: cpu.times.idle,
      total: Object.values(cpu.times).reduce((acc, time) => acc + time, 0)
    }));
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const endMeasure = os.cpus().map(cpu => ({
      idle: cpu.times.idle,
      total: Object.values(cpu.times).reduce((acc, time) => acc + time, 0)
    }));

    const cpuUsage = startMeasure.map((start, i) => {
      const end = endMeasure[i];
      const idle = end.idle - start.idle;
      const total = end.total - start.total;
      return ((total - idle) / total) * 100;
    });

    return cpuUsage.reduce((acc, usage) => acc + usage, 0) / cpuUsage.length;
  }
}

async function getNetworkStats() {
  try {
    // On Unix-like systems, we can read network stats from /proc/net/dev
    if (process.platform !== 'win32') {
      const initialStats = await fs.promises.readFile('/proc/net/dev', 'utf8');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const finalStats = await fs.promises.readFile('/proc/net/dev', 'utf8');

      const parseStats = (stats: string) => {
        const lines = stats.split('\n').slice(2); // Skip header lines
        return lines.reduce((acc, line) => {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 10 && !parts[0].includes('lo:')) { // Skip loopback
            const interface_name = parts[0].replace(':', '');
            acc[interface_name] = {
              rx_bytes: parseInt(parts[1], 10),
              tx_bytes: parseInt(parts[9], 10)
            };
          }
          return acc;
        }, {} as Record<string, { rx_bytes: number; tx_bytes: number }>);
      };

      const initial = parseStats(initialStats);
      const final = parseStats(finalStats);

      let totalSpeed = 0;
      let activeInterfaces = 0;

      Object.keys(initial).forEach(iface => {
        const rxDiff = final[iface]?.rx_bytes - initial[iface]?.rx_bytes;
        const txDiff = final[iface]?.tx_bytes - initial[iface]?.tx_bytes;
        const totalDiff = rxDiff + txDiff;

        if (totalDiff > 0) {
          totalSpeed += totalDiff;
          activeInterfaces++;
        }
      });

      return {
        speed: activeInterfaces ? (totalSpeed / activeInterfaces / 1024 / 1024).toFixed(2) : '0', // MB/s
        latency: 0 // We'll measure this in the frontend
      };
    }

    // Fallback for non-Unix systems
    return {
      speed: '0',
      latency: 0
    };
  } catch (error) {
    console.error('Error getting network stats:', error);
    return {
      speed: '0',
      latency: 0
    };
  }
}

/**
 * @swagger
 * /api/system-info:
 *   get:
 *     summary: Get system information
 *     description: Returns system information including CPU, memory, and network details
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: System information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 platform:
 *                   type: string
 *                   example: darwin
 *                 arch:
 *                   type: string
 *                   example: x64
 *                 hostname:
 *                   type: string
 *                   example: MacBook-Pro
 *                 type:
 *                   type: string
 *                   example: Darwin
 *                 release:
 *                   type: string
 *                   example: 21.6.0
 *                 cpus:
 *                   type: array
 *                   items:
 *                     type: object
 *                 cpuUsage:
 *                   type: number
 *                   example: 12.5
 *                 totalMemory:
 *                   type: number
 *                   example: 17179869184
 *                 freeMemory:
 *                   type: number
 *                   example: 8589934592
 *                 network:
 *                   type: object
 *                   properties:
 *                     speed:
 *                       type: string
 *                       example: 0.25
 *                     latency:
 *                       type: number
 *                       example: 0
 */
export async function GET() {
  const [cpuUsage, networkStats] = await Promise.all([
    getCpuUsage(),
    getNetworkStats()
  ]);

  const systemInfo = {
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    type: os.type(),
    release: os.release(),
    cpus: os.cpus(),
    cpuUsage,
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    network: networkStats
  };

  return NextResponse.json(systemInfo);
} 