# 🏥 BoniCare Orthopedic Platform

<div align="center">

![BoniCare](https://img.shields.io/badge/BoniCare-Healthcare%20Platform-blue)
![Node.js](https://img.shields.io/badge/Node.js-v20%2B-brightgreen)
![Express](https://img.shields.io/badge/Express-v5.1-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-v8.19-green)
![License](https://img.shields.io/badge/license-ISC-blue)

**A professional, production-ready healthcare backend platform designed specifically for orthopedic clinics and practitioners.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation--setup) • [API Endpoints](#-api-endpoints-detailed) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🚀 Features

### 🔐 Authentication & Authorization
- **Role-Based Access Control (RBAC)**: Distinct permissions for Patients, Doctors, and Administrators
- **Secure Authentication**: JWT-based authentication with refresh token logic and bcrypt password hashing
- **Token Management**: Access tokens (15m) and refresh tokens (7 days) for enhanced security
- **Request Validation**: Robust input validation using express-validator

### 📅 Appointment Management
- **Smart Booking System**: Real-time availability checks for doctors with conflict detection
- **Flexible Scheduling**: Book, cancel, and manage appointments with full lifecycle tracking
- **Doctor Availability Management**: Doctors can set and manage their working hours and availability slots
- **Patient Dashboard**: Centralized view of all appointments with status tracking
- **Doctor Dashboard**: Complete appointment overview for healthcare providers

### 👥 Patient Management
- **Patient Profiles**: Comprehensive patient information management
- **Medical History**: Complete chronological records of consultations and medical files
- **Dashboard Analytics**: Real-time view of appointments, documents, and consultations
- **Patient-Doctor Connections**: Direct communication and consultation records

### 👨‍⚕️ Doctor Management
- **Doctor Profiles**: Detailed professional profiles with specializations
- **Availability Management**: Flexible availability scheduling system
- **Appointment Management**: Track and manage all assigned appointments
- **Professional Scheduling**: Support for recurring availability patterns

### 🏥 Medical Records & File Management
- **Secure File Uploads**: Integration with AWS S3 or Local storage for medical documents
- **Multiple File Types**: Support for medical scans, X-rays, reports, and clinical documents
- **File Versioning**: Track file history and modifications
- **Secure Access**: File access controlled through role-based permissions

### 💬 Real-Time Communication
- **Live Chat System**: Real-time messaging between doctors and patients via Socket.IO
- **Redis Adapter**: Scalable multi-instance socket communication
- **Automatic Notifications**: Instant message delivery and notifications
- **Conversation Management**: Organization of chat conversations

### 🔔 Notifications System
- **Firebase Cloud Messaging (FCM)**: Push notifications to mobile devices
- **Email Notifications**: Automated appointment confirmations and reminders via Nodemailer
- **Multi-Channel Alerts**: Combined notification strategies
- **Customizable Triggers**: Event-based notification system

### 📊 Reports & Analytics
- **AI Report Generation**: Support for AI-generated analysis on medical scans
- **Report Management**: Store and retrieve medical reports with metadata
- **Patient-Doctor Correlation**: Link reports to specific consultations

### 🔍 Data Management
- **Database Seeding**: Comprehensive seed data for development and testing
- **Data Integrity**: Mongoose validation and schema enforcement
- **MongoDB Optimization**: Indexed queries and aggregate operations

---

## 🛠 Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Backend Framework** | Node.js + Express.js | v20+, v5.1 |
| **Database** | MongoDB + Mongoose | v8.19 |
| **Real-Time Communication** | Socket.IO + Redis Adapter | v4.8, v8.3 |
| **Authentication** | JWT + bcrypt + Express-Validator | Latest |
| **File Storage** | AWS S3 SDK + Multer | v3.1, v2.0 |
| **Email Service** | Nodemailer | v8.0 |
| **Push Notifications** | Firebase Admin SDK | v13.8 |
| **API Documentation** | Swagger UI + Swagger-JSDoc | v5.0, v6.2 |
| **Testing** | Jest + Supertest + MongoDB Memory Server | Latest |
| **Development Tools** | Nodemon + Morgan | v3.1, v1.10 |
| **Security** | Helmet + CORS | Latest |
| **Utilities** | Faker.js | v10.4 |

---

## 🧱 System Architecture

The project follows a **modular MVC (Model-View-Controller) pattern** with a dedicated **Service Layer** for business logic, ensuring scalability, maintainability, and separation of concerns.

```
┌─────────────────────────────────────────────────────┐
│                    HTTP Client                       │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              Express.js Router & Middleware          │
│          (CORS, Morgan, Auth, Error Handling)        │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                   Controllers                        │
│         (Request Handling & Response Formatting)     │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                  Services Layer                      │
│  (Business Logic: Chat, Notifications, File Upload) │
└─────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────┬──────────────────────────────┐
│   Mongoose Models    │   External Services          │
│  (Data Schema)       │  (AWS S3, FCM, Nodemailer)   │
└──────────────────────┴──────────────────────────────┘
                         ↓
┌──────────────────────┬──────────────────────────────┐
│     MongoDB          │        Redis                 │
│   (Main Database)    │  (Cache & Real-time)         │
└──────────────────────┴──────────────────────────────┘
```

### Layer Responsibilities

- **Controller Layer**: Handles HTTP requests, validates input, calls services, and formats responses
- **Service Layer**: Implements core business logic (Chat, Notifications, File Operations, Appointments)
- **Model Layer**: Defines Mongoose schemas and database structure
- **Middleware**: Handles cross-cutting concerns (Authentication, Error Handling, Request Logging)
- **Validators**: Ensures data integrity through express-validator schemas

---

## 📂 Project Structure

```
orthopedic-platform-BoniCare-/
├── src/
│   ├── chat/                   # Socket.IO configuration and real-time events
│   │   └── socket.js          # Socket.IO initialization and event handlers
│   │
│   ├── config/                 # Application configuration
│   │   ├── constants.js        # Global constants and configuration values
│   │   └── db.js              # MongoDB connection setup
│   │
│   ├── controllers/            # Request handlers and business logic orchestration
│   │   ├── authController.js  # Authentication endpoints (signup, login)
│   │   ├── appointmentController.js  # Appointment booking and management
│   │   ├── doctorController.js  # Doctor profile and availability management
│   │   ├── patientController.js # Patient dashboard and profile
│   │   └── filesController.js  # Medical file uploads and management
│   │
│   ├── middleware/             # Express middleware functions
│   │   ├── authMiddleware.js  # JWT token verification and role-based access
│   │   ├── errorHandler.js    # Global error handling and validation
│   │   └── uploadMiddleware.js # File upload configuration (Multer)
│   │
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js            # Base user model
│   │   ├── patient.js         # Patient profile schema
│   │   ├── DoctorProfile.js   # Doctor profile schema
│   │   ├── DoctorAvailability.js # Doctor availability slots
│   │   ├── Appointment.js     # Appointment booking schema
│   │   ├── medicalFile.js     # Medical file metadata
│   │   ├── AiReport.js        # AI-generated reports
│   │   └── chatModels.js      # Chat and conversation models
│   │
│   ├── routes/                 # Express route definitions
│   │   ├── auth.js            # Authentication routes
│   │   ├── appointment.js      # Appointment management routes
│   │   ├── doctor.js          # Doctor management routes
│   │   ├── patient.js         # Patient routes
│   │   └── files.js           # File upload routes
│   │
│   ├── services/               # Core business logic services
│   │   ├── fileService.js     # File upload and management logic
│   │   ├── messageService.js  # Chat message handling
│   │   └── notificationService.js # Email and push notifications
│   │
│   ├── validators/             # Express-validator schemas
│   │   ├── authValidators.js  # Auth request validation
│   │   ├── appointmentValidators.js # Appointment validation
│   │   ├── doctorValidators.js # Doctor data validation
│   │   └── fileValidators.js  # File upload validation
│   │
│   ├── seeds/                  # Database seeding scripts
│   │   ├── index.js           # Seed orchestration
│   │   ├── userSeed.js        # User seed data
│   │   ├── patientSeed.js     # Patient seed data
│   │   ├── doctorSeed.js      # Doctor seed data
│   │   ├── appointmentSeed.js # Appointment seed data
│   │   ├── supportingSeed.js  # Additional seed data
│   │   ├── helper.js          # Seed utility functions
│   │   └── README.md          # Seeding documentation
│   │
│   ├── swagger.js              # Swagger/OpenAPI documentation setup
│   └── utils/                  # Utility functions
│       └── AppError.js         # Custom error class
│
├── tests/                      # Test files
│   ├── unit/                   # Unit tests
│   │   ├── appointment.test.js
│   │   ├── doctorAvailability.test.js
│   │   ├── doctorProfile.test.js
│   │   ├── errorHandler.test.js
│   │   └── AppError.test.js
│   └── utils/
│       └── dbHandler.js        # Test database setup
│
├── uploads/                    # Local file storage directory
│
├── server.js                   # Express application entry point
├── docker-compose.yml          # Docker Compose configuration
├── Dockerfile                  # Docker container setup
├── package.json                # Project dependencies and scripts
├── .env.example                # Environment variables template
├── README.md                   # Project documentation
├── CONTRIBUTING.md             # Contributing guidelines
└── LICENSE                     # ISC License

```

---

## 📡 API Endpoints (Detailed)

### Base URL
```
http://localhost:3000/api/v1
```

### Interactive Documentation
Explore the complete API with Swagger UI at:
```
http://localhost:3000/api-docs
```

---

### 🔐 Authentication Endpoints

#### 1. **User Registration**
```
POST /auth/signup
```
**Description**: Register a new user (Patient, Doctor, or Admin)

**Request Body**:
```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "string (min 8 characters)",
  "role": "patient | doctor | admin",
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "string"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "ObjectId",
    "username": "string",
    "email": "string",
    "role": "string",
    "accessToken": "JWT token",
    "refreshToken": "JWT token"
  }
}
```

**Errors**: 400 (Validation), 409 (Duplicate email/username)

---

#### 2. **User Login**
```
POST /auth/login
```
**Description**: Authenticate user and receive tokens

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "ObjectId",
      "email": "string",
      "username": "string",
      "role": "string"
    },
    "accessToken": "JWT token (expires in 15m)",
    "refreshToken": "JWT token (expires in 7d)"
  }
}
```

**Errors**: 401 (Invalid credentials), 404 (User not found)

---

### 📅 Appointment Endpoints

#### 1. **Get All Doctors**
```
GET /appointment/doctors
```
**Description**: Retrieve list of all doctors with profiles

**Authentication**: Required (Patient, Admin)

**Query Parameters**:
- `page` (optional): Page number for pagination
- `limit` (optional): Records per page

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "firstName": "string",
      "lastName": "string",
      "specialization": "string",
      "yearsOfExperience": "number",
      "email": "string",
      "phoneNumber": "string",
      "clinicLocation": "string",
      "bio": "string"
    }
  ],
  "total": "number"
}
```

---

#### 2. **Get Doctor Availability**
```
GET /appointment/doctors/:doctorId/availability
```
**Description**: Get available appointment slots for a specific doctor

**Authentication**: Required (Patient, Admin)

**Path Parameters**:
- `doctorId`: ID of the doctor

**Query Parameters**:
- `date` (optional): Filter by specific date (YYYY-MM-DD)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "doctorId": "ObjectId",
    "availabilitySlots": [
      {
        "_id": "ObjectId",
        "dayOfWeek": "Monday",
        "startTime": "09:00",
        "endTime": "17:00",
        "isBooked": false,
        "slotDuration": 30
      }
    ]
  }
}
```

---

#### 3. **Book Appointment**
```
POST /appointment/book
```
**Description**: Book a new appointment with a doctor

**Authentication**: Required (Patient only)

**Request Body**:
```json
{
  "doctorId": "ObjectId",
  "appointmentDate": "2026-04-20",
  "appointmentTime": "10:00",
  "reason": "string (optional)",
  "notes": "string (optional)"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "_id": "ObjectId",
    "patientId": "ObjectId",
    "doctorId": "ObjectId",
    "appointmentDate": "2026-04-20",
    "appointmentTime": "10:00",
    "status": "confirmed",
    "reason": "string",
    "createdAt": "ISO date"
  }
}
```

**Errors**: 400 (Invalid date/time), 409 (Slot already booked), 404 (Doctor not found)

---

#### 4. **Get Patient Appointments**
```
GET /appointment/my-appointments
```
**Description**: Retrieve all appointments for the logged-in patient

**Authentication**: Required (Patient)

**Query Parameters**:
- `status` (optional): Filter by status (confirmed, cancelled, completed)
- `page` (optional): Page number
- `limit` (optional): Records per page

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "doctorId": {
        "_id": "ObjectId",
        "firstName": "string",
        "lastName": "string",
        "specialization": "string"
      },
      "appointmentDate": "2026-04-20",
      "appointmentTime": "10:00",
      "status": "confirmed",
      "reason": "string",
      "createdAt": "ISO date"
    }
  ],
  "total": "number"
}
```

---

#### 5. **Cancel Appointment**
```
PUT /appointment/:id/cancel
```
**Description**: Cancel an existing appointment

**Authentication**: Required (Patient, Doctor, Admin)

**Path Parameters**:
- `id`: Appointment ID

**Request Body**:
```json
{
  "cancellationReason": "string (optional)"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "data": {
    "_id": "ObjectId",
    "status": "cancelled",
    "cancellationReason": "string",
    "cancelledAt": "ISO date"
  }
}
```

**Errors**: 404 (Appointment not found), 400 (Already cancelled)

---

### 👨‍⚕️ Doctor Endpoints

#### 1. **Get Doctor Profile**
```
GET /doctor/profile
```
**Description**: Retrieve the logged-in doctor's profile

**Authentication**: Required (Doctor only)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "userId": "ObjectId",
    "firstName": "string",
    "lastName": "string",
    "specialization": "string",
    "yearsOfExperience": "number",
    "bio": "string",
    "phoneNumber": "string",
    "clinicLocation": "string",
    "qualifications": ["string"],
    "medicalLicenseNumber": "string",
    "profileImage": "url (optional)",
    "createdAt": "ISO date"
  }
}
```

---

#### 2. **Update Doctor Profile**
```
PUT /doctor/profile
```
**Description**: Update doctor profile information

**Authentication**: Required (Doctor only)

**Request Body**:
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "specialization": "string (optional)",
  "yearsOfExperience": "number (optional)",
  "bio": "string (optional)",
  "phoneNumber": "string (optional)",
  "clinicLocation": "string (optional)",
  "qualifications": ["string"] (optional),
  "profileImage": "file (optional)"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated profile object */ }
}
```

---

#### 3. **Get Doctor Availability**
```
GET /doctor/availability
```
**Description**: Get all availability slots for the logged-in doctor

**Authentication**: Required (Doctor only)

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "dayOfWeek": "Monday",
      "startTime": "09:00",
      "endTime": "17:00",
      "slotDuration": 30,
      "isActive": true,
      "createdAt": "ISO date"
    }
  ]
}
```

---

#### 4. **Add Availability Slot**
```
POST /doctor/availability
```
**Description**: Add a new availability slot

**Authentication**: Required (Doctor only)

**Request Body**:
```json
{
  "dayOfWeek": "Monday | Tuesday | ... | Sunday",
  "startTime": "09:00",
  "endTime": "17:00",
  "slotDuration": 30
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Availability slot added successfully",
  "data": {
    "_id": "ObjectId",
    "dayOfWeek": "string",
    "startTime": "string",
    "endTime": "string",
    "slotDuration": "number"
  }
}
```

**Errors**: 400 (Invalid time range), 409 (Slot already exists)

---

#### 5. **Delete Availability Slot**
```
DELETE /doctor/availability/:id
```
**Description**: Remove an availability slot

**Authentication**: Required (Doctor only)

**Path Parameters**:
- `id`: Availability slot ID

**Response** (200):
```json
{
  "success": true,
  "message": "Availability slot deleted successfully"
}
```

---

#### 6. **Get Doctor Appointments**
```
GET /doctor/appointments
```
**Description**: Retrieve all appointments for the logged-in doctor

**Authentication**: Required (Doctor only)

**Query Parameters**:
- `date` (optional): Filter by date
- `status` (optional): Filter by status
- `page` (optional): Page number

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "patientId": {
        "_id": "ObjectId",
        "firstName": "string",
        "lastName": "string",
        "email": "string"
      },
      "appointmentDate": "2026-04-20",
      "appointmentTime": "10:00",
      "status": "confirmed",
      "reason": "string",
      "notes": "string"
    }
  ],
  "total": "number"
}
```

---

### 👤 Patient Endpoints

#### 1. **Get Patient Dashboard**
```
GET /patient/dashboard
```
**Description**: Get comprehensive patient dashboard with appointments and medical files

**Authentication**: Required (Patient only)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "profile": {
      "_id": "ObjectId",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phoneNumber": "string",
      "dateOfBirth": "date",
      "gender": "string"
    },
    "upcomingAppointments": [
      {
        "_id": "ObjectId",
        "doctorId": "ObjectId",
        "appointmentDate": "date",
        "appointmentTime": "time",
        "status": "string"
      }
    ],
    "medicalFiles": [
      {
        "_id": "ObjectId",
        "fileName": "string",
        "fileType": "string",
        "uploadDate": "date",
        "url": "string"
      }
    ],
    "totalAppointments": "number",
    "completedAppointments": "number"
  }
}
```

---

### 📁 File Management Endpoints

#### 1. **Upload Medical File**
```
POST /files/upload
```
**Description**: Upload medical documents and files (X-rays, reports, scans)

**Authentication**: Required (Patient only)

**Content-Type**: multipart/form-data

**Form Fields**:
- `file`: Binary file (Max: 10MB)
  - Supported formats: PDF, JPG, PNG, JPEG, DICOM
- `fileType`: string (xray | scan | report | prescription | other)
- `description`: string (optional)

**Response** (201):
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "_id": "ObjectId",
    "fileName": "string",
    "fileType": "string",
    "fileSize": "number (bytes)",
    "uploadedBy": "ObjectId",
    "uploadDate": "ISO date",
    "fileUrl": "string",
    "description": "string"
  }
}
```

**Errors**: 400 (Invalid file type), 413 (File too large), 500 (Upload failed)

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js**: v20 or higher
- **npm**: v10 or higher
- **MongoDB**: Local instance or MongoDB Atlas connection
- **Redis**: For real-time features (optional for local development)
- **AWS S3** (optional): For cloud file storage

### 1. Clone the Repository

```bash
git clone https://github.com/KerolisKhalaf/orthopedic-platform-BoniCare-.git
cd orthopedic-platform-BoniCare-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the template and configure your environment:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
MONGO_URI=mongodb://127.0.0.1:27017/bonicare
MONGODB_TEST_URI=mongodb://127.0.0.1:27017/bonicare_test

# Redis (for real-time features)
REDIS_URL=redis://127.0.0.1:6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your_super_secret_key_min_32_characters_long
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_characters_long
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# 2FA Configuration (Optional)
TOTP_ISSUER=BoniCare
TOTP_ALGORITHM=sha1
TOTP_DIGITS=6
TOTP_PERIOD=30

# AWS S3 Configuration (Optional)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=bonicare-files
STORAGE_TYPE=local # or 's3' for AWS

# Firebase Configuration (Optional, for push notifications)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=gmail
```

### 4. Setup Database

#### Option A: Local MongoDB
Ensure MongoDB is running:
```bash
# For Windows
mongod

# For Mac
brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)
Update `MONGO_URI` in `.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bonicare?retryWrites=true&w=majority
```

### 5. Setup Redis (Optional but recommended)

```bash
# Install Redis
# For Windows: Use WSL or Docker
# For Mac: brew install redis

# Start Redis
redis-server
```

**Or using Docker**:
```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

### 6. Seed the Database (Optional)

Populate the database with sample data:

```bash
# First seed
npm run seed

# Reset and reseed
npm run seed:reset
```

### 7. Start the Server

**Development Mode** (with hot reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

**Expected Output**:
```
Server running on port 3000
Socket.IO initialized
MongoDB connected successfully
```

---

## 🔐 Environment Variables Reference

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `NODE_ENV` | string | ✓ | `development` | Environment (development/production/test) |
| `PORT` | number | ✓ | `3000` | Server listening port |
| `API_VERSION` | string | ✓ | `v1` | API version for routes |
| `MONGO_URI` | string | ✓ | `mongodb://127.0.0.1:27017/bonicare` | MongoDB connection string |
| `MONGODB_TEST_URI` | string | ✓ | `mongodb://127.0.0.1:27017/bonicare_test` | Test database URI |
| `REDIS_URL` | string | ✗ | `redis://127.0.0.1:6379` | Redis connection URL |
| `REDIS_PASSWORD` | string | ✗ | - | Redis authentication password |
| `JWT_SECRET` | string | ✓ | - | Secret for access token signing (min 32 chars) |
| `JWT_REFRESH_SECRET` | string | ✓ | - | Secret for refresh token signing (min 32 chars) |
| `JWT_EXPIRES_IN` | string | ✓ | `15m` | Access token expiration time |
| `JWT_REFRESH_EXPIRES_IN` | string | ✓ | `7d` | Refresh token expiration time |
| `TOTP_ISSUER` | string | ✗ | `BoniCare` | 2FA issuer name |
| `TOTP_ALGORITHM` | string | ✗ | `sha1` | 2FA algorithm |
| `TOTP_DIGITS` | number | ✗ | `6` | 2FA code digit count |
| `TOTP_PERIOD` | number | ✗ | `30` | 2FA time period in seconds |
| `AWS_REGION` | string | ✗ | `us-east-1` | AWS region for S3 |
| `AWS_ACCESS_KEY_ID` | string | ✗ | - | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | string | ✗ | - | AWS secret key |
| `AWS_BUCKET_NAME` | string | ✗ | `bonicare-files` | S3 bucket name |
| `STORAGE_TYPE` | string | ✗ | `local` | Storage type (local or s3) |
| `FIREBASE_PROJECT_ID` | string | ✗ | - | Firebase project ID |
| `FIREBASE_PRIVATE_KEY` | string | ✗ | - | Firebase private key |
| `FIREBASE_CLIENT_EMAIL` | string | ✗ | - | Firebase client email |
| `EMAIL_USER` | string | ✗ | - | Email service username |
| `EMAIL_PASSWORD` | string | ✗ | - | Email service password |
| `EMAIL_SERVICE` | string | ✗ | `gmail` | Email service provider |

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Test Files Location
- Unit tests: `tests/unit/`
- Test utilities: `tests/utils/`
- Database mock: MongoDB Memory Server

### Test Structure
```
tests/
├── unit/
│   ├── appointment.test.js
│   ├── doctorAvailability.test.js
│   ├── doctorProfile.test.js
│   ├── errorHandler.test.js
│   └── AppError.test.js
└── utils/
    └── dbHandler.js
```

---

## 🔄 Real-Time Features

### Socket.IO Communication

BoniCare uses **Socket.IO** with **Redis Adapter** for scalable real-time communication.

#### Socket Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `joinConversation` | Client → Server | `{ conversationId: string }` | Join a chat room |
| `leaveConversation` | Client → Server | `{ conversationId: string }` | Leave a chat room |
| `sendMessage` | Client → Server | `{ conversationId, content, receiverId }` | Send a chat message |
| `newMessage` | Server → Client | `{ messageObject }` | Receive a new message |
| `messageDelivered` | Server → Client | `{ messageId, timestamp }` | Message delivery confirmation |
| `messageRead` | Server → Client | `{ messageId, readAt }` | Message read receipt |
| `typing` | Client → Server | `{ conversationId, userId }` | Indicate typing status |
| `userTyping` | Server → Client | `{ userId, conversationId }` | User typing notification |
| `userOnline` | Server → Client | `{ userId, status }` | User online/offline status |
| `appointmentNotification` | Server → Client | `{ appointmentData }` | Real-time appointment update |

#### Connection Setup (Client-side)

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: { token: accessToken }
});

// Join conversation
socket.emit('joinConversation', { conversationId: 'conv_123' });

// Send message
socket.emit('sendMessage', {
  conversationId: 'conv_123',
  content: 'Hello doctor!',
  receiverId: 'doctor_id'
});

// Listen for messages
socket.on('newMessage', (message) => {
  console.log('New message:', message);
});
```

#### Redis Adapter Configuration

The Redis adapter enables Socket.IO to work across multiple server instances:
- Handles message broadcasting across instances
- Maintains session state in Redis
- Provides horizontal scalability
- Enables real-time notification routing

---

## 🐳 Docker Setup

### Build and Run with Docker Compose

```bash
docker-compose up -d
```

### Services in Docker Compose
- **Node App**: Runs on port 3000
- **MongoDB**: Runs on port 27017
- **Redis**: Runs on port 6379

### Build Docker Image

```bash
docker build -t bonicare:latest .
docker run -p 3000:3000 --env-file .env bonicare:latest
```

---

## 📊 Database Models

### Core Collections

1. **User**: Base authentication model
2. **Patient**: Patient profile and medical history
3. **DoctorProfile**: Doctor credentials and specialization
4. **DoctorAvailability**: Doctor working hours and slots
5. **Appointment**: Booking records with status tracking
6. **Medical Files**: Uploaded medical documents metadata
7. **AiReport**: AI-generated analysis reports
8. **Chat Models**: Conversation and message storage

---

## 🔒 Security Best Practices

- **JWT Tokens**: 15-minute access tokens with 7-day refresh tokens
- **Password Hashing**: bcrypt with salt rounds 10
- **CORS**: Configured for authorized origins only
- **Helmet**: HTTP security headers protection
- **Input Validation**: Express-validator on all endpoints
- **Error Handling**: Secure error responses without sensitive info
- **File Upload Security**: File type validation and size limits
- **Database**: MongoDB injection prevention through Mongoose
- **Role-Based Access**: RBAC middleware on all protected routes

---

## 📚 API Documentation

### Swagger/OpenAPI

Interactive API documentation is automatically generated and available at:

```
http://localhost:3000/api-docs
```

Features:
- Real-time API exploration
- Try-it-out functionality
- Request/response examples
- Authentication configuration
- Parameter documentation

### Postman Collection

Import the API endpoints into Postman:
1. Open Postman
2. Click "Import"
3. Use collection URL or JSON file
4. Configure environment variables

---

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running or update `MONGO_URI` for Atlas

#### Redis Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution**: Redis is optional; disable or start Redis service

#### JWT Token Expired
**Solution**: Use refresh token endpoint to obtain new access token

#### File Upload Failed (413)
**Solution**: Check file size limit (default 10MB) in middleware

#### Port Already in Use
```bash
# Find process using port 3000
# Windows
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

---

## 🚀 Performance Optimization

- **Database Indexing**: Optimized queries with proper indexes
- **Redis Caching**: Session and message caching
- **Socket.IO Adapter**: Redis-backed broadcast for scalability
- **File Compression**: Gzip compression on responses
- **Request Validation**: Early validation prevents server load
- **Error Handling**: Efficient error processing and logging

---

## 📈 Monitoring & Logging

- **Morgan**: HTTP request logging
- **Console**: Application event logging
- **Error Tracking**: Centralized error handler with stack traces
- **Database Logs**: MongoDB query logging
- **Socket Events**: Real-time connection tracking

---

## 🤝 Contributing

We welcome contributions to BoniCare! Please follow these steps:

### 1. Fork the Repository
```bash
git clone https://github.com/KerolisKhalaf/orthopedic-platform-BoniCare-.git
cd orthopedic-platform-BoniCare-
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/AmazingFeature
```

### 3. Make Your Changes
- Follow existing code style
- Add tests for new features
- Update documentation as needed

### 4. Commit Your Changes
```bash
git commit -m 'Add some AmazingFeature'
```

### 5. Push to Your Branch
```bash
git push origin feature/AmazingFeature
```

### 6. Open a Pull Request
- Describe your changes clearly
- Reference any related issues
- Wait for review and feedback

---

## 📄 License

This project is distributed under the **ISC License**. See the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join project discussions
- **Email**: For urgent inquiries, contact the maintainer

---

## 🎯 Roadmap

- [ ] Enhanced 2FA with TOTP
- [ ] Video consultation integration
- [ ] Prescription management system
- [ ] Advanced analytics dashboard
- [ ] Mobile app APIs
- [ ] Billing and payments system
- [ ] Telemedicine features
- [ ] AI-powered appointment recommendations

---

## 🙏 Acknowledgments

- Built with Node.js and Express.js
- Database powered by MongoDB
- Real-time features by Socket.IO
- Authentication with JWT
- File storage via AWS S3 and Multer

---

<div align="center">

**Made with ❤️ by the BoniCare Team**

[⬆ Back to top](#-bonicare-orthopedic-platform)

</div>