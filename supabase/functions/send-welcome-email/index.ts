/// <reference types="https://deno.land/x/deno/cli/types/dts/index.d.ts" />

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'npm:resend'; // Using npm specifier for Resend SDK

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const FROM_EMAIL = 'vince@afrotape.co.ke'; // Your verified Resend "From" address

if (!RESEND_API_KEY) {
  console.error('Missing RESEND_API_KEY environment variable');
}
if (!OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY environment variable');
}

// Initialize Resend client if the key exists
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

async function generateEmailContent(userEmail: string): Promise<{ subject: string; html: string } | null> {
  if (!OPENAI_API_KEY) {
    console.error('Cannot generate email content: OpenAI API key is missing.');
    return null;
  }

  const prompt = `
Generate a welcoming email subject line and HTML body for a new user who just signed up for "Discover Diani Explorer", a platform for exploring Diani Beach, Kenya.
The user's email is: ${userEmail}
Keep the tone friendly, exciting, and concise.
The HTML body should be simple, perhaps mention exploring activities, accommodations, or local tips. Include a call to action, like visiting their dashboard or exploring the site.

Respond ONLY with a JSON object containing "subject" and "html" keys, like this:
{
  "subject": "Generated Subject Line",
  "html": "<p>Generated HTML content...</p>"
}
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Or use a newer model if preferred
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 400, // Adjust as needed
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`OpenAI API error: ${response.status} ${response.statusText}`, errorBody);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('OpenAI response did not contain expected content:', JSON.stringify(data));
      return null;
    }

    // Attempt to parse the JSON string within the content
    try {
      const emailData = JSON.parse(content);
      if (typeof emailData.subject === 'string' && typeof emailData.html === 'string') {
        return emailData;
      } else {
        console.error('Parsed OpenAI content does not have subject and html strings:', emailData);
        // Fallback: Use the raw content if parsing fails but content exists
        return { subject: "Welcome to Discover Diani Explorer!", html: `<p>${content.replace(/\n/g, '<br>')}</p>` };
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response content as JSON:', parseError);
      // Fallback: Use the raw content if parsing fails
       return { subject: "Welcome to Discover Diani Explorer!", html: `<p>${content.replace(/\n/g, '<br>')}</p>` };
    }

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return null;
  }
}

serve(async (req: Request) => {
  // 1. Check if it's a POST request and keys are available
  if (req.method !== 'POST' || !resend || !OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: 'Invalid request or missing API keys' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 2. Parse the request body from the Supabase hook
    //    The exact structure might vary slightly based on the hook (Validate User vs User Signed Up)
    //    Check Supabase docs or logs for the exact payload structure. Common fields: type, table, record, old_record
    const payload = await req.json();
    console.log('Received payload:', JSON.stringify(payload, null, 2)); // Log payload for debugging

    // Adjust based on actual payload structure. Assuming 'Validate User' hook structure.
    const userEmail = payload?.record?.email;
    const userId = payload?.record?.id; // Useful for logging or further actions

    if (!userEmail || !userId) {
      console.error('Email or User ID not found in payload:', payload);
      return new Response(JSON.stringify({ error: 'User email or ID not found in webhook payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing welcome email for user: ${userId} (${userEmail})`);

    // 3. Generate dynamic content via OpenAI
    let emailContent = await generateEmailContent(userEmail); // Changed const to let

    if (!emailContent) {
      // Use a default fallback if generation fails
      console.warn('OpenAI content generation failed. Sending default email.');
      emailContent = {
        subject: 'Welcome to Discover Diani Explorer!',
        html: `<p>Welcome aboard, ${userEmail}!</p><p>We're thrilled to have you join Discover Diani Explorer. Start exploring the best of Diani Beach today!</p><p>Visit your dashboard or browse the site to get started.</p>`,
      };
    }

    // 4. Send the email using Resend
    console.log(`Sending email to ${userEmail} from ${FROM_EMAIL} with subject: ${emailContent.subject}`);
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [userEmail],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email', details: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Email sent successfully:', data);
    return new Response(JSON.stringify({ success: true, message: 'Welcome email sent successfully', resend_id: data?.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error processing request:', err);
    return new Response(JSON.stringify({ error: 'Internal server error', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

console.log(`Function "send-welcome-email" up and running!`);
