import { NextResponse } from 'next/server';
import { getSwaggerSpecs, isSwaggerEnabled } from '@/lib/swagger';

/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: Get OpenAPI specification
 *     description: Returns the OpenAPI specification for the API
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       403:
 *         description: Forbidden - Swagger documentation is disabled
 */
export async function GET() {
  // Check if Swagger documentation is enabled in settings
  if (!isSwaggerEnabled()) {
    return NextResponse.json(
      { error: 'Swagger documentation is disabled' },
      { status: 403 }
    );
  }

  // Generate the specs dynamically
  const specs = getSwaggerSpecs();
  return NextResponse.json(specs);
} 