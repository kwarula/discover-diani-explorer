
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Verify the request has a valid authentication
  const authHeader = req.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized request' }), { 
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    // Get the key type requested from the request
    const { keyType } = await req.json()
    
    // Validate the key type
    if (!keyType || typeof keyType !== 'string') {
      throw new Error('Invalid key type requested')
    }
    
    // Map the requested key type to the corresponding environment variable
    const keyMapping = {
      'openweather': Deno.env.get('OPENWEATHER_API_KEY'),
      'stormglass': Deno.env.get('STORMGLASS_API_KEY'),
      'worldtides': Deno.env.get('WORLD_TIDES_API_KEY'),
    }
    
    if (!(keyType in keyMapping) || !keyMapping[keyType]) {
      throw new Error(`API key for '${keyType}' not found or not configured`)
    }
    
    // Return the requested key
    return new Response(JSON.stringify({ 
      key: keyMapping[keyType],
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Error in get-api-keys function:', error)
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
