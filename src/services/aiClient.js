import dotenv from 'dotenv';
import fs from 'fs/promises';
import logger from '../utils/logger.js';
import AppError from '../utils/AppError.js';

dotenv.config();

/**
 * AI Service Client to communicate with the FastAPI microservice.
 * This client uses the internal Docker network to reach 'ai-service'.
 * Uses native fetch (Node 18+) with standard Blob and FormData.
 */
class AIServiceClient {
    constructor() {
        this.baseURL = process.env.AI_SERVICE_URL || 'http://ai-service:8000';
        this.apiKey = process.env.AI_SERVICE_API_KEY || 'test';
    }

    /**
     * Unified request helper to handle native fetch, AbortController timeouts,
     * JSON parsing, error logging, and standard status mapping.
     * 
     * @private
     */
    async _request(endpoint, options = {}, timeoutMs = 15000) {
        const url = `${this.baseURL}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const headers = {
            'X-API-Key': this.apiKey,
            ...options.headers
        };

        try {
            logger.debug('Sending request to AI Service', { url, method: options.method || 'GET' });

            const response = await fetch(url, {
                ...options,
                headers,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const contentType = response.headers.get('content-type') || '';
            let bodyText = '';
            try {
                bodyText = await response.text();
            } catch (readError) {
                logger.error('Failed to read response body from AI Service', { url, error: readError });
            }

            let responseData;
            if (contentType.includes('application/json')) {
                try {
                    responseData = JSON.parse(bodyText);
                } catch (parseError) {
                    logger.error('Failed to parse JSON response from AI Service', { url, bodyText, error: parseError });
                    throw new AppError('Invalid JSON response from AI service', 502);
                }
            } else {
                logger.warn('AI Service returned non-JSON response', { url, contentType, bodyText });
                throw new AppError(`Non-JSON response from AI service: Received status ${response.status}`, 502);
            }

            if (!response.ok) {
                const errorMessage = responseData.detail || responseData.error || responseData.message || `AI Service request failed with status ${response.status}`;
                logger.error('AI Service returned error status', { url, status: response.status, responseData });
                throw new AppError(errorMessage, response.status === 400 ? 400 : 502);
            }

            return responseData;

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                logger.error('AI Service request timed out', { url, timeoutMs });
                throw new AppError('AI Service request timed out', 504);
            }

            if (error instanceof AppError) {
                throw error;
            }

            logger.error('AI Service communication failure', { url, error: error.message, stack: error.stack });
            throw new AppError('AI Service is currently unavailable or returned a network error', 503);
        }
    }

    /**
     * Get home status of AI Service
     */
    async checkHealth() {
        return this._request('/', { method: 'GET' });
    }

    /**
     * Send features for lower back diagnosis
     * @param {Array<number>} features - Array of 12 medical features
     */
    async predictLowerBack(features) {
        return this._request('/lower-back', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ features })
        });
    }

    /**
     * Read file from disk and predict bone fracture
     * @param {Object} file - Express Multer file object
     */
    async predictBoneFracture(file) {
        if (!file || !file.path) {
            throw new AppError('No file provided for bone fracture prediction', 400);
        }

        // Read file safely from disk
        let buffer;
        try {
            buffer = await fs.readFile(file.path);
        } catch (readError) {
            logger.error('Failed to read file from disk for prediction', { filePath: file.path, error: readError });
            throw new AppError('Failed to process image file on disk', 500);
        }

        // Convert Buffer to Blob (using global Blob)
        const blob = new Blob([buffer], { type: file.mimetype });

        // Build FormData
        const formData = new FormData();
        formData.append('file', blob, file.originalname);

        return this._request('/bone-fracture', {
            method: 'POST',
            body: formData
        });
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
                probabilities: prediction.probabilities || []
            },
            confidence: prediction.confidence || 0
        };
    }
}

export const aiClient = new AIServiceClient();
export default aiClient;
