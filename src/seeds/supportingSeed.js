import AiReport from '../models/AiReport.js';
import MedicalFile from '../models/medicalFile.js';
import { fakerInstance, log } from './helper.js';

export const seedSupporting = async (patients) => {
  log('Seeding AiReports and medicalFiles...');
  
  for (const patient of patients) {
    const file = new MedicalFile({
      patient: patient._id, // Updated reference
      filename: `doc_${fakerInstance.string.alphanumeric(5)}.pdf`,
      uploadedAt: new Date()
    });
    const savedFile = await file.save();

    const report = new AiReport({
      patient: patient._id,
      file: savedFile._id,
      output_json: {
        analysis: "ICD-10: R91.8 (Other nonspecific abnormal findings on diagnostic imaging of lung)"
      },
      confidence: 0.95
    });
    await report.save();
  }
  
  log('Supporting entities seeded successfully.');
};
