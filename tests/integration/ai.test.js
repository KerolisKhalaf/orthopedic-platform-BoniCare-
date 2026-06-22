import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import path from 'path';
import fs from 'fs/promises';

// Import router
import aiRouter from '../../src/routes/aiRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/v1/ai', aiRouter);

describe('AI Route Integration Tests', () => {
    let mockFetch;
    let testFilePath;
    const testFileName = 'test_image.jpg';

    beforeAll(async () => {
        // Create dummy file for upload
        testFilePath = path.join(process.cwd(), testFileName);
        await fs.writeFile(testFilePath, 'dummy image content');
    });

    afterAll(async () => {
        try {
            await fs.unlink(testFilePath);
        } catch {}
    });

    beforeEach(() => {
        mockFetch = jest.spyOn(globalThis, 'fetch');
    });

    afterEach(() => {
        mockFetch.mockRestore();
    });

    it('should successfully predict bone fracture and delete the temp file from disk', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: (header) => header === 'content-type' ? 'application/json' : null
            },
            text: async () => JSON.stringify({
                status: 'success',
                label: 'NOT FRACTURED',
                confidence: '95.50%'
            })
        });

        const res = await request(app)
            .post('/api/v1/ai/bone-fracture')
            .attach('file', testFilePath);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data.label).toBe('NOT FRACTURED');
        expect(res.body.data.confidence).toBe('95.50%');

        expect(mockFetch).toHaveBeenCalledTimes(1);

        // Verify file cleanup
        const files = await fs.readdir(path.join(process.cwd(), 'uploads'));
        const tempFiles = files.filter(f => f.startsWith('test_image_'));
        expect(tempFiles.length).toBe(0);
    });

    it('should handle AI service unavailable (503) and still clean up the uploaded file', async () => {
        mockFetch.mockRejectedValue(new Error('fetch failed'));

        const res = await request(app)
            .post('/api/v1/ai/bone-fracture')
            .attach('file', testFilePath);

        expect(res.status).toBe(503);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toContain('AI Service is currently unavailable');

        // Verify file cleanup
        const files = await fs.readdir(path.join(process.cwd(), 'uploads'));
        const tempFiles = files.filter(f => f.startsWith('test_image_'));
        expect(tempFiles.length).toBe(0);
    });

    it('should handle non-JSON responses from AI service and clean up the file', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            status: 500,
            headers: {
                get: (header) => header === 'content-type' ? 'text/html' : null
            },
            text: async () => 'Internal Server Error (HTML response)'
        });

        const res = await request(app)
            .post('/api/v1/ai/bone-fracture')
            .attach('file', testFilePath);

        expect(res.status).toBe(502);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toContain('Non-JSON response from AI service');

        // Verify file cleanup
        const files = await fs.readdir(path.join(process.cwd(), 'uploads'));
        const tempFiles = files.filter(f => f.startsWith('test_image_'));
        expect(tempFiles.length).toBe(0);
    });
});
