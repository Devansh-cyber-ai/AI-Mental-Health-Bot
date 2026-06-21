// server/routes/chat.js
const express = require('express');
const router = express.Router();
const { getAvailableProviders, generateWithFallback } = require('./providers');

// ─── GET /api/chat/models — Return available AI models ───────────
router.get('/models', (req, res) => {
    const models = getAvailableProviders();
    res.json({ models });
});

// ─── POST /api/chat — Send message to selected AI model ─────────
router.post('/', async (req, res) => {
    const { prompt, history, model } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    // 1. Safety Guardrail: Crisis Detection
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'want to die', 'self harm'];
    const isCrisis = crisisKeywords.some(word => prompt.toLowerCase().includes(word));
    
    if (isCrisis) {
        return res.json({ 
            reply: "I'm really sorry you're feeling this way, but I'm an AI and cannot provide the help you need. Please reach out to a professional immediately.\n\n**Crisis Text Line:** Text HOME to 741741\n**National Suicide Prevention Lifeline:** 988\n**International Association for Suicide Prevention:** https://www.iasp.info/resources/Crisis_Centres/",
            usedModel: model || 'system',
            usedModelName: 'Crisis Response',
            usedModelIcon: '🆘'
        });
    }

    // 2. System Prompting: Setting the AI's Persona
    const systemInstruction = `
        You are a highly empathetic, supportive, and non-judgmental mental health chatbot. 
        Your goal is to listen, validate feelings, and offer gentle coping strategies. 
        You are NOT a licensed therapist. Keep your answers concise, conversational, and warm.
        Use markdown formatting sparingly — bold for emphasis is fine, but keep responses natural.
    `;

    // 3. Build multi-turn conversation history for context
    const contents = [];
    
    if (history && Array.isArray(history)) {
        // Skip leading AI messages (e.g. the hardcoded greeting) —
        // Gemini requires conversations to start with a "user" role
        let foundFirstUser = false;
        for (const msg of history) {
            if (!foundFirstUser && msg.sender !== 'user') continue;
            foundFirstUser = true;
            contents.push({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            });
        }
    }

    // Add the current user message
    contents.push({
        role: 'user',
        parts: [{ text: prompt }]
    });

    try {
        // 4. Call the selected AI model with auto-fallback
        const selectedModel = model || 'gemini';
        const result = await generateWithFallback(selectedModel, systemInstruction, contents);

        res.json({
            reply: result.reply,
            usedModel: result.usedModel,
            usedModelName: result.usedModelName,
            usedModelIcon: result.usedModelIcon
        });
        
    } catch (error) {
        console.error("AI Error:", error.message);
        res.status(500).json({ error: "All AI models are currently unavailable. Please try again later." });
    }
});

module.exports = router;