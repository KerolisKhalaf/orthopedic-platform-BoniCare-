BoniCare Orthopedic Platform


  BoniCare is a professional, production-ready healthcare backend platform designed specifically for orthopedic clinics
  and practitioners. It provides a comprehensive suite of tools for managing patient records, doctor availability,
  appointment scheduling, and real-time communication between patients and specialists.

  🚀 Features

  🔐 Authentication & Authorization
   * Role-Based Access Control (RBAC): Distinct permissions for Patients, Doctors, and Administrators.
   * Secure Auth: JWT-based authentication with refresh token logic and bcrypt password hashing.
   * Validation: Robust request validation using express-validator.

  📅 Appointment Management
   * Smart Booking: Real-time availability checks for doctors.
   * Lifecycle Tracking: Seamlessly book, cancel, and manage appointments.
   * Dashboard Integration: Centralized views for both patients and doctors.

  🏥 Medical Records & AI
   * Secure File Uploads: Integration with AWS S3 or Local storage for medical documents.
   * AI Analysis: Support for AI-generated reports on medical scans and history.
   * Patient History: Complete chronological record of consultations and files.

  💬 Real-Time & Notifications
   * Live Chat: Real-time messaging between doctors and patients powered by Socket.IO and Redis.
   * Push Notifications: Integrated with Firebase Cloud Messaging (FCM).
   * Email Alerts: Automated email notifications via Nodemailer for appointment confirmations.

  ---

  🛠 Tech Stack

  ┌───────────────┬────────────────────────────────────────┐
  │ Category      │ Technology                             │
  ├───────────────┼────────────────────────────────────────┤
  │ Backend       │ Node.js (v20+), Express.js (v5.1)      │
  │ Database      │ MongoDB (Mongoose v8.19)               │
  │ Real-Time     │ Socket.IO, Redis                       │
  │ Storage       │ AWS S3 / Local Storage                 │
  │ Auth          │ JWT (jsonwebtoken), bcrypt             │
  │ Testing       │ Jest, Supertest, MongoDB Memory Server │
  │ Documentation │ Swagger / OpenAPI 3.0                  │
  └───────────────┴────────────────────────────────────────┘
  ---

  🧱 System Architecture

  The project follows a modular MVC (Model-View-Controller) pattern with a dedicated Service Layer for business logic,
  ensuring scalability and maintainability.

   * Controller Layer: Handles HTTP requests and response formatting.
   * Service Layer: Contains core business logic (Chat, Notifications, File Processing).
   * Model Layer: Mongoose schemas defining the data structure.
   * Middleware: Handles cross-cutting concerns (Auth, Error Handling, File Parsing).

  ---

  📂 Project Structure

    1 D:\projects\orthopedic-platform-BoniCare-\
    2 ├── src/
    3 │   ├── api/            # External API integrations
    4 │   ├── chat/           # Socket.IO configuration and events
    5 │   ├── config/         # DB connection and app constants
    6 │   ├── controllers/    # Request handlers
    7 │   ├── middleware/     # Auth, Upload, and Global Error handlers
    8 │   ├── models/         # Mongoose schemas
    9 │   ├── notification/   # Firebase and Email service logic
   10 │   ├── routes/         # Express API routes
   11 │   ├── seeds/          # Database seeding scripts
   12 │   ├── services/       # Core business logic
   13 │   ├── utils/          # Global utilities (AppError, etc.)
   14 │   └── validators/     # Request validation schemas
   15 ├── tests/              # Unit and Integration tests
   16 ├── server.js           # Entry point
   17 └── .env.example        # Environment template

  ---

  ⚙️ Installation & Setup

  1. Clone the repository
   1 git clone https://github.com/KerolisKhalaf/orthopedic-platform-BoniCare-.git
   2 cd bonicare

  2. Install dependencies
   1 npm install

  3. Configure environment
  Copy the template and fill in your credentials:
   1 cp .env.example .env

  4. Seed the database (Optional)
   1 npm run seed

  5. Run the server
  Development:
   1 npm run dev
  Production:
   1 npm start

  ---

  🔐 Environment Variables

  ┌──────────────┬───────────────────────────┬────────────────────────────────────┐
  │ Variable     │ Description               │ Default                            │
  ├──────────────┼───────────────────────────┼────────────────────────────────────┤
  │ PORT         │ Server listening port     │ 3000                               │
  │ MONGO_URI    │ MongoDB connection string │ mongodb://127.0.0.1:27017/bonicare │
  │ REDIS_URL    │ Redis connection URL      │ redis://127.0.0.1:6379             │
  │ JWT_SECRET   │ Secret for access tokens  │ your_secret_here                   │
  │ STORAGE_TYPE │ local or s3               │ local                              │
  │ AWS_BUCKET   │ AWS S3 Bucket Name        │ bonicare-files                     │
  └──────────────┴───────────────────────────┴────────────────────────────────────┘
  ---

  📡 API Documentation

  Interactive API documentation is available via Swagger at:
  http://localhost:3000/api-docs

  Auth Endpoints
   * POST /api/v1/auth/signup - Register a new user
   * POST /api/v1/auth/login - Authenticate and get tokens

  Appointment Endpoints
   * GET /api/v1/appointment/doctors - List all doctors
   * POST /api/v1/appointment/book - Book an appointment (Patient only)
   * PUT /api/v1/appointment/:id/cancel - Cancel an existing appointment

  Doctor Endpoints
   * GET /api/v1/doctor/profile - Get current doctor profile
   * POST /api/v1/doctor/availability - Set working hours

  ---

  🧪 Testing

  The project uses Jest and Supertest for comprehensive testing.

   1 # Run all tests
   2 npm test
   3
   4 # Run tests with coverage
   5 npm test -- --coverage

  ---

  🔄 Real-Time Features

  BoniCare uses Socket.IO for low-latency communication.

  ┌──────────────────┬─────────────────────────────────────────┬──────────────────────────────────────┐
  │ Event            │ Payload                                 │ Description                          │
  ├──────────────────┼─────────────────────────────────────────┼──────────────────────────────────────┤
  │ joinConversation │ { id: conversationId }                  │ Joins a chat room                    │
  │ sendMessage      │ { conversationId, content, receiverId } │ Sends a chat message                 │
  │ newMessage       │ { messageObject }                       │ Triggered when a message is received │
  └──────────────────┴─────────────────────────────────────────┴──────────────────────────────────────┘
  ---

  🤝 Contributing

   1. Fork the Project
   2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
   3. Commit your Changes (git commit -m 'Add some AmazingFeature')
   4. Push to the Branch (git push origin feature/AmazingFeature)
   5. Open a Pull Request

  ---

  📄 License
  Distributed under the ISC License.