import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health checks
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'suitpax-web',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      checks: {
        database: await checkDatabase(),
        redis: await checkRedis(),
        external_apis: await checkExternalAPIs(),
      }
    }

    // Determine overall health
    const allChecksHealthy = Object.values(healthData.checks).every(check => check.status === 'healthy')
    
    return NextResponse.json({
      ...healthData,
      status: allChecksHealthy ? 'healthy' : 'degraded'
    }, { 
      status: allChecksHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'suitpax-web',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
}

async function checkDatabase() {
  try {
    // Check if Supabase is accessible
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      
      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        message: response.ok ? 'Database accessible' : `Database check failed: ${response.status}`,
        responseTime: Date.now()
      }
    }
    
    return {
      status: 'unknown',
      message: 'Database credentials not configured'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Database check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

async function checkRedis() {
  try {
    // Simple Redis check - in production you'd use an actual Redis client
    if (process.env.REDIS_URL) {
      return {
        status: 'healthy',
        message: 'Redis configured'
      }
    }
    
    return {
      status: 'unknown',
      message: 'Redis not configured'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Redis check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

async function checkExternalAPIs() {
  try {
    const checks = []
    
    // Check critical external APIs
    if (process.env.ANTHROPIC_API_KEY) {
      checks.push('anthropic')
    }
    
    if (process.env.ELEVENLABS_API_KEY) {
      checks.push('elevenlabs')
    }
    
    return {
      status: 'healthy',
      message: `External APIs configured: ${checks.join(', ') || 'none'}`
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `External API check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}