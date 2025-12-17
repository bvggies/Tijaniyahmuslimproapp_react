import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: true,
        provider: 'PostgreSQL (Neon)',
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/health:', error);
    return NextResponse.json(
      {
        ok: false,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: {
          connected: false,
          provider: 'PostgreSQL (Neon)',
        },
      },
      { status: 500 },
    );
  }
}


