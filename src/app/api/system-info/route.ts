import { NextResponse } from 'next/server';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

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
  const initialStats = os.networkInterfaces();
  await new Promise(resolve => setTimeout(resolve, 1000));
  const finalStats = os.networkInterfaces();

  let totalSpeed = 0;
  let activeInterfaces = 0;

  Object.keys(initialStats).forEach(iface => {
    const initial = initialStats[iface]?.[0];
    const final = finalStats[iface]?.[0];
    if (initial && final) {
      const bytesPerSecond = (final.bytes - initial.bytes) / 1;
      if (bytesPerSecond > 0) {
        totalSpeed += bytesPerSecond;
        activeInterfaces++;
      }
    }
  });

  return {
    speed: activeInterfaces ? (totalSpeed / activeInterfaces / 1024 / 1024).toFixed(2) : 0, // MB/s
    latency: 0 // We'll measure this in the frontend
  };
}

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