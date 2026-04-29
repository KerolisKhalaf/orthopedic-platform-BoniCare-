import dotenv from 'dotenv';

dotenv.config();

/**
 * AI Service Client to communicate with the FastAPI microservice.
 * This client uses the internal Docker network to reach 'ai-service'.
 * Uses native fetch (Node 18+) to avoid adding new dependencies.
 */
class AIServiceClient {
    constructor() {
        this.baseURL = process.env.AI_SERVICE_URL || 'http://ai-service:8000';
        this.apiKey = process.env.AI_SERVICE_API_KEY || 'test';
    }

    /**
     * Get home status of AI Service
     */
    async checkHealth() {
        try {
            const response = await fetch(`${this.baseURL}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.apiKey
                }
            });
            return await response.json();
        } catch (error) {
            console.error('AI Service Health Check Failed:', error.message);
            throw new Error('AI Service is currently unavailable.');
        }
    }

    /**
     * Send features for lower back diagnosis
     * @param {Array<number>} features - Array of 12 medical features
     */
    async predictLowerBack(features) {
        try {
            const response = await fetch(`${this.baseURL}/lower-back`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.apiKey
                },
                body: JSON.stringify({ features })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('AI Service Error Response:', data);
                throw new Error(data.detail || 'AI Prediction failed');
            }

            return data;
        } catch (error) {
            console.error('AI Service Communication Error:', error.message);
            throw error;
        }
    }

    async predictBoneFracture(fileBuffer) {
    try {
        const formData = new FormData();
        formData.append('file', fileBuffer, 'image.jpg');

        const response = await fetch(`${this.baseURL}/bone-fracture`, {
            method: 'POST',
            headers: {
                'X-API-Key': this.apiKey
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Bone prediction failed');
        }

        return data;

    } catch (error) {
        console.error('Bone AI Error:', error.message);
        throw error;
    }
}


    /**
     * Format the prediction result for AiReport model
     * @param {Object} prediction - Raw prediction from AI service
     * @returns {Object} Formatted data for AiReport schema
     */
    formatForReport(prediction) {
        return {
            model_name: "lower-back-v1",
            output_json: {
                label: prediction.label,
                prediction: prediction.prediction,
                probabilities: prediction.confidence
            },
            confidence: Math.max(...(prediction.confidence || [0]))
        };
    }
}

export const aiClient = new AIServiceClient();
export default aiClient;
