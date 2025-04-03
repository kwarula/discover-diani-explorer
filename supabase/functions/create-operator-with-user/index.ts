import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts'; // Assuming shared CORS headers

// Define expected input structure (should match AddOperatorFormValues + Zod schema)
interface OperatorInput {
  userEmail: string;
  businessName: string;
  contactPersonName: string;
  contactEmail: string;
  contactPhone: string;
  businessType: string;
  description?: string;
  // Add other fields from your form schema if necessary
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // --- Validate Input ---
    let input: OperatorInput;
    try {
      input = await req.json();
      // Basic validation (consider more robust validation like Zod if needed)
      if (!input.userEmail || !input.businessName || !input.contactPersonName || !input.contactEmail || !input.contactPhone || !input.businessType) {
         throw new Error("Missing required fields in input.");
      }
      if (!/\S+@\S+\.\S+/.test(input.userEmail)) {
         throw new Error("Invalid user email format.");
      }
       if (!/\S+@\S+\.\S+/.test(input.contactEmail)) {
         throw new Error("Invalid contact email format.");
      }
    } catch (jsonError) {
      console.error("Failed to parse request body:", jsonError);
      return new Response(JSON.stringify({ success: false, message: `Invalid request body: ${jsonError.message}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // --- Initialize Supabase Admin Client ---
    // Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in Edge Function secrets
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
        console.error("Missing Supabase environment variables.");
        throw new Error("Server configuration error: Missing Supabase credentials.");
    }
    
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
       auth: {
         // Required for admin actions
         autoRefreshToken: false,
         persistSession: false
       }
    });

    // --- Create User in Supabase Auth ---
    console.log(`Attempting to create user with email: ${input.userEmail}`);
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: input.userEmail,
      email_confirm: true, // Send confirmation/invitation email
      // You might want to add a temporary password or other options here
      // user_metadata: { role: 'operator' } // Example metadata
    });

    if (userError) {
      console.error("Supabase Auth user creation error:", userError);
      // Handle specific errors like user already exists
      if (userError.message.includes("User already registered")) {
         return new Response(JSON.stringify({ success: false, message: `User with email ${input.userEmail} already exists.` }), {
           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
           status: 409, // Conflict
         });
      }
      throw new Error(`Failed to create user: ${userError.message}`);
    }

    if (!userData || !userData.user) {
        throw new Error("User creation did not return expected data.");
    }
    const userId = userData.user.id;
    console.log(`Successfully created user with ID: ${userId}`);

    // --- Create Operator Profile in Database ---
    console.log(`Attempting to insert operator profile for user ID: ${userId}`);
    const { data: operatorData, error: operatorError } = await supabaseAdmin
      .from('operators')
      .insert({
        user_id: userId, // Link to the newly created user
        business_name: input.businessName,
        contact_person_name: input.contactPersonName,
        contact_email: input.contactEmail,
        contact_phone: input.contactPhone,
        business_type: input.businessType,
        description: input.description,
        status: 'pending_verification', // Default status for admin-added operators
        // Add defaults for other required fields if any
      })
      .select() // Select the inserted data to get the new operator ID
      .single(); // Expect only one row inserted

    if (operatorError) {
      console.error("Supabase operator insertion error:", operatorError);
      // Optional: Attempt to delete the created user if operator insertion fails? (Complex rollback)
      throw new Error(`Failed to create operator profile: ${operatorError.message}`);
    }
    
    if (!operatorData) {
        throw new Error("Operator profile creation did not return expected data.");
    }
    const operatorId = operatorData.id;
    console.log(`Successfully created operator profile with ID: ${operatorId}`);

    // --- Return Success Response ---
    return new Response(JSON.stringify({ 
        success: true, 
        message: 'Operator and user account created successfully. Invitation email sent.',
        userId: userId,
        operatorId: operatorId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Unhandled error in Edge Function:", error);
    return new Response(JSON.stringify({ success: false, message: error.message || 'An unexpected server error occurred.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
