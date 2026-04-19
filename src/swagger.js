import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BoniCare API',
      version: '1.0.0',
      description: 'Professional healthcare backend API',
    },
    servers: [{ url: 'http://localhost:3000/api/v1' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['patient', 'doctor', 'admin'] }
          }
        },
        Patient: {
          type: 'object',
          properties: {
            user: { type: 'string' },
            dob: { type: 'string', format: 'date' },
            gender: { type: 'string', enum: ['male', 'female', 'other'] }
          }
        },
        Doctor: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            specialty: { type: 'string' },
            hospitalInfo: { type: 'string' }
          }
        },
        Appointment: {
          type: 'object',
          properties: {
            patientId: { type: 'string' },
            doctorId: { type: 'string' },
            scheduledDate: { type: 'string', format: 'date-time' },
            status: { type: 'string' }
          }
        },
        MedicalFile: {
          type: 'object',
          properties: {
            filename: { type: 'string' },
            uploadedAt: { type: 'string', format: 'date-time' }
          }
        },
        AIReport: {
          type: 'object',
          properties: {
            model_name: { type: 'string' },
            output_json: { type: 'object' },
            confidence: { type: 'number' }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            type: { type: 'string', enum: ['chat_message', 'status_change'] },
            channel: { type: 'string', enum: ['push', 'email'] },
            status: { type: 'string', enum: ['pending', 'delivered', 'failed'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        NotificationPreferences: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            pushEnabled: { type: 'boolean' },
            emailEnabled: { type: 'boolean' }
          }
        }
      }
    },
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js', './src/api/*.js'],
};

export const specs = swaggerJsdoc(options);
