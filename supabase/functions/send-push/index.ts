
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import serviceAccount from './service-account.json' assert { type: 'json' }

// Use npm: specifiers for robustness with Supabase Edge Functions
import admin from 'npm:firebase-admin@12.0.0'

const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
}

// Initialize only once
if (admin.apps.length === 0) {
    admin.initializeApp(firebaseConfig)
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { user_id, title, body, data } = await req.json()

        if (!user_id || !title || !body) {
            throw new Error('Missing required fields: user_id, title, body')
        }

        // 1. Get User Tokens from Supabase
        const { data: devices, error: dbError } = await supabase
            .from('user_devices')
            .select('token')
            .eq('user_id', user_id)

        if (dbError) throw dbError

        const tokens = devices?.map(d => d.token).filter(Boolean) || []

        if (tokens.length === 0) {
            return new Response(
                JSON.stringify({ message: 'No devices found for user', success: false }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // 2. Send Multicast Message
        const message = {
            notification: {
                title,
                body
            },
            data: data || {},
            tokens: tokens
        }

        // Using admin.messaging() from the npm module
        const response = await admin.messaging().sendEachForMulticast(message)

        // 3. Cleanup Invalid Tokens
        if (response.failureCount > 0) {
            const failedTokens: string[] = []
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    // Check prompt for specific error codes if needed, e.g. 'messaging/invalid-registration-token'
                    failedTokens.push(tokens[idx])
                }
            })

            if (failedTokens.length > 0) {
                await supabase
                    .from('user_devices')
                    .delete()
                    .in('token', failedTokens)
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                sent: response.successCount,
                failed: response.failureCount
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
