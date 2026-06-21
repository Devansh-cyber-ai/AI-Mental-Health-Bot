// server/routes/providers.js
// Unified provider abstraction for multiple AI models

const { GoogleGenAI } = require('@google/genai');
const Groq = require('groq-sdk');
const { CohereClientV2 } = require('cohere-ai');

// ─── Provider Definitions ───────────────────────────────────────
const providers = {
    gemini: {
        name: 'Gemini 2.0 Flash',
        icon: '✨',
        id: 'gemini',
        envKey: 'GEMINI_API_KEY',
        generate: async (systemInstruction, contents) => {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: contents,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.7
                }
            });
            return response.text;
        }
    },

    groq: {
        name: 'Llama 3.3 70B',
        icon: '⚡',
        id: 'groq',
        envKey: 'GROQ_API_KEY',
        generate: async (systemInstruction, contents) => {
            const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

            // Convert Gemini-format contents to OpenAI-format messages
            const messages = [
                { role: 'system', content: systemInstruction }
            ];
            for (const entry of contents) {
                messages.push({
                    role: entry.role === 'model' ? 'assistant' : 'user',
                    content: entry.parts.map(p => p.text).join('')
                });
            }

            const response = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1024,
            });
            return response.choices[0].message.content;
        }
    },

    cohere: {
        name: 'Cohere Command',
        icon: '🔷',
        id: 'cohere',
        envKey: 'COHERE_API_KEY',
        generate: async (systemInstruction, contents) => {
            const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });

            // Convert Gemini-format contents to Cohere-format messages
            const messages = [
                { role: 'system', content: systemInstruction }
            ];
            for (const entry of contents) {
                messages.push({
                    role: entry.role === 'model' ? 'assistant' : 'user',
                    content: entry.parts.map(p => p.text).join('')
                });
            }

            const response = await cohere.chat({
                model: 'command-a-08-2025',
                messages: messages,
                temperature: 0.7,
            });
            return response.message.content[0].text;
        }
    }
};

// ─── Helper: Get available providers (only those with API keys set) ──
function getAvailableProviders() {
    return Object.values(providers)
        .filter(p => process.env[p.envKey])
        .map(p => ({ id: p.id, name: p.name, icon: p.icon }));
}

// ─── Helper: Generate reply with fallback ────────────────────────
async function generateWithFallback(modelId, systemInstruction, contents) {
    const available = Object.keys(providers).filter(id => process.env[providers[id].envKey]);

    if (available.length === 0) {
        throw new Error('No AI providers configured. Please add at least one API key.');
    }

    // Put selected model first, then the rest as fallbacks
    const order = [modelId, ...available.filter(id => id !== modelId)].filter(id => available.includes(id));

    let lastError = null;
    for (const id of order) {
        try {
            const reply = await providers[id].generate(systemInstruction, contents);
            return { reply, usedModel: id, usedModelName: providers[id].name, usedModelIcon: providers[id].icon };
        } catch (error) {
            console.warn(`Provider "${id}" failed: ${error.message}`);
            lastError = error;
            // Continue to next provider
        }
    }

    throw lastError || new Error('All AI providers failed.');
}

module.exports = { providers, getAvailableProviders, generateWithFallback };
