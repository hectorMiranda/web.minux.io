import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
  const systemInfo = {
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    type: os.type(),
    release: os.release(),
    cpus: os.cpus().length,
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
  };

  return NextResponse.json(systemInfo);
} 