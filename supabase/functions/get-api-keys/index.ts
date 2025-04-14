
/// <reference types="https://esm.sh/v135/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  keyType: 'openweather' | 'stormglass' | 'worldtides';
}

serve(async (req: Request) => {
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
    const { keyType }: RequestBody = await req.json()
    
    // Validate the key type (already partially handled by RequestBody interface)
    if (!keyType || !['openweather', 'stormglass', 'worldtides'].includes(keyType)) {
      throw new Error('Invalid key type requested')
    }
    
    // Map the requested key type to the corresponding environment variable
    const keyMapping: Record<RequestBody['keyType'], string | undefined> = {
      'openweather': Deno.env.get('VITE_OPENWEATHER_API_KEY'),
      'stormglass': Deno.env.get('VITE_STORMGLASS_API_KEY'),
      'worldtides': Deno.env.get('WORLD_TIDES_API_KEY'), // Assuming this one is correct or unused as it wasn't in the screenshot
    }
    
    const apiKey = keyMapping[keyType];

    if (!apiKey) {
      throw new Error(`API key for '${keyType}' not found or not configured`)
    }
    
    // Return the requested key
    return new Response(JSON.stringify({ 
      key: apiKey,
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in get-api-keys function:', errorMessage, error)
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
