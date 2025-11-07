
import { GoogleGenAI, Type } from "@google/genai";
import type { Patient, Consult } from '../types';

// IMPORTANT: Do NOT configure an API key here. It will be provided by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askGeminiFlash(history: { role: string, parts: { text: string }[] }[], newMessage: string) {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
    });
    const result = await chat.sendMessageStream({ message: newMessage });
    return result;
}

export async function askGeminiProThinking(history: { role: string, parts: { text: string }[] }[], newMessage: string) {
    const chat = ai.chats.create({
        model: 'gemini-2.5-pro',
        history: history,
        config: {
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    const result = await chat.sendMessageStream({ message: newMessage });
    return result;
}

export async function triageConsults(consults: Consult[]): Promise<any> {
    const prompt = `
        You are an expert Acute Pain Service physician. Triage the following new consult requests.
        For each consult, provide a "urgency" level ('High', 'Medium', or 'Low') and a brief "rationale" (max 15 words).
        Base your triage on the reason provided. High sedation and uncontrolled pain are high urgency. Routine checks are lower.
        
        Consults Data:
        ${JSON.stringify(consults.map(c => ({ id: c.id, reason: c.reason })), null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.NUMBER },
                            urgency: { type: Type.STRING },
                            rationale: { type: Type.STRING },
                        },
                        required: ["id", "urgency", "rationale"]
                    }
                }
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error triaging consults:", error);
        return null;
    }
}

export async function analyzePatient(patient: Patient): Promise<any> {
    const prompt = `
        As an expert APS physician, analyze this patient's data and provide recommendations.
        The patient data is: ${JSON.stringify(patient, null, 2)}.
        
        Tasks:
        1.  **recommendation**: Based on their vitals, procedure, and current plan, suggest one key optimization. (e.g., 'Consider adding a regional block for opioid-sparing effect.')
        2.  **reboundPainRisk**: Predict the risk of rebound pain ('High', 'Medium', 'Low') after their current primary analgesia (like a block or epidural) wears off.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendation: { type: Type.STRING },
                        reboundPainRisk: { type: Type.STRING },
                    },
                    required: ["recommendation", "reboundPainRisk"]
                }
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error(`Error analyzing patient ${patient.id}:`, error);
        return null;
    }
}
