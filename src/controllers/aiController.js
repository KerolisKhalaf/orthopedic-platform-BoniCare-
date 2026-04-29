import AiReport from '../models/AiReport.js';
import Patient from '../models/patient.js';
import MedicalFile from '../models/medicalFile.js';
import aiClient from '../services/aiClient.js';

/**
 * Controller for handling AI Prediction and Persistence
 */
export const getAndSavePrediction = async (req, res) => {
    try {
        const { patientId, fileId, features, doctorId } = req.body;

        // 1. Validation
        if (!patientId || !features || !Array.isArray(features) || features.length !== 12) {
            return res.status(400).json({
                status: 'error',
                message: 'patientId and exactly 12 medical features are required.'
            });
        }

        // Verify patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                status: 'error',
                message: 'Patient not found'
            });
        }

        // 2. Fetch Prediction from AI Microservice
        let prediction;
        try {
            prediction = await aiClient.predictLowerBack(features);
        } catch (aiError) {
            return res.status(503).json({
                status: 'error',
                message: 'AI Service Error: ' + aiError.message
            });
        }

        // 3. Prepare and Save AiReport
        const formattedData = aiClient.formatForReport(prediction);
        const newReport = new AiReport({
            ...formattedData,
            patient: patientId,
            file: fileId || null,
            // We could store doctorId if we added it to schema, 
            // but per directive we don't change AiReport schema.
            // However, we can put it in output_json or notes if needed.
        });

        const savedReport = await newReport.save();

        // 4. Link to Patient's Medical History / File
        try {
            // Option A: Link to MedicalFile if fileId provided
            if (fileId) {
                await MedicalFile.findByIdAndUpdate(fileId, {
                    $push: { aiReports: savedReport._id }
                });
            }

            // Option B: Update Patient medical_history (Additive link)
            // We don't want to overwrite, so we use $set with dot notation or similar
            // Since medical_history is an object, we can add a 'last_ai_report' field
            await Patient.findByIdAndUpdate(patientId, {
                $set: { 'medical_history.last_ai_report': savedReport._id }
            });

        } catch (linkError) {
            // We log the error but don't fail the request since the report IS saved
            console.error('Failed to link AI Report to history:', linkError.message);
        }

        return res.status(201).json({
            status: 'success',
            data: savedReport
        });

    } catch (error) {
        console.error('Prediction Controller Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error during AI processing'
        });
    }
};


export const predictBoneFracture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'Image file is required'
            });
        }

        const result = await aiClient.predictBoneFracture(req.file.buffer);

        return res.status(200).json({
            status: 'success',
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};


/**
 * Health check for AI Service
 */
export const checkAiStatus = async (req, res) => {
    try {
        const health = await aiClient.checkHealth();
        return res.status(200).json({
            status: 'success',
            aiStatus: health
        });
    } catch (error) {
        return res.status(503).json({
            status: 'error',
            message: 'AI Service Unavailable'
        });
    }
};
