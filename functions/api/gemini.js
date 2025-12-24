// Cloudflare Pages Function - Secure Gemini API Proxy
export async function onRequestPost(context) {
    const GEMINI_API_KEY = context.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
        return new Response(JSON.stringify({ error: 'API key not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const body = await context.request.json();
        const prompt = body.prompt;
        
        if (!prompt) {
            return new Response(JSON.stringify({ error: 'No prompt provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.8, maxOutputTokens: 500 }
            })
        });
        
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
