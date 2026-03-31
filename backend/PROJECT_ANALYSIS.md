# BoniCare Orthopedic Platform - Project Analysis & Roadmap

## 📋 CURRENT PROJECT SUMMARY

### Tech Stack
- **Runtime**: Node.js (ES6 modules)
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB with Mongoose v8.19.1
- **Authentication**: JWT + Bcrypt
- **File Management**: Multer v2.0.2
- **Security**: Helmet, CORS, Morgan logging
- **Validation**: express-validator

### Project Structure (MVC Pattern - Partially Implemented)
```
src/
├── config/           ✅ DB connection
├── controllers/      ⚠️  Partial (Auth, Patient, Files - no Appointments/Doctors)
├── middleware/       ⚠️  Auth (has bug), error handling
├── models/           ⚠️  User, Patient, MedicalFile, AiReport (missing: Doctor, Appointment)
├── routes/           ⚠️  Auth, Files, Patient (needs: Appointments, Doctors, AI)
├── validators/       ⚠️  Auth, Files (needs: appointments, doctors)
```

### Current API Endpoints (ISSUE: Not v1-prefixed)
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/files/upload
GET    /api/patient/dashboard
```

---

## 🔴 CRITICAL ISSUES TO FIX

### 1. **Auth Middleware Bug** (authMiddleware.js)
```javascript
// CURRENT (BROKEN):
if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json(...);  // Returns here (line 6)
    const token = authHeader.split(' ')[1]; // UNREACHABLE!
```
**Fix**: Move token parsing INSIDE the if block or restructure logic

### 2. **API Routes Not Versioned**
- Current: `/api/auth/login`
- Required: `/api/v1/auth/login`

### 3. **File Storage Mismatch**
- Current: Stores only to filesystem via Multer
- Required: Store metadata in MongoDB + integrate with AI pipeline

### 4. **Missing Critical Models**
- ❌ Appointment model
- ❌ Doctor profile model
- ❌ Doctor availability model

### 5. **Incomplete Role-Based Architecture**
- User model has `role` (patient/doctor/admin) but routes only protect for `patient`
- No doctor-specific endpoints

---

## 🎯 REQUIREMENTS ANALYSIS FOR MVP

### Phase 1: Fix Existing Code & Structure
1. **Fix auth middleware bug**
2. **Implement API v1 versioning** - Restructure server.js
3. **Create missing models**: Appointment, Doctor, DoctorAvailability
4. **Enhance User model** to include doctor-specific fields
5. **Create validators** for all new endpoints
6. **Fix file upload** to save metadata to MongoDB

### Phase 2: Implement Appointment System
**Models Required:**
```javascript
// Doctor Profile (extends User)
- user (ref: User)
- specialty (Orthopedics, Sports Medicine, etc.)
- bio, licenseNumber
- yearsOfExperience
- hospital/clinic info

// DoctorAvailability
- doctor (ref: User)
- dayOfWeek (0-6)
- startTime, endTime
- isActive

// Appointment
- patient (ref: User)
- doctor (ref: User)
- scheduledDate, startTime, endTime
- status (scheduled/completed/cancelled)
- symptoms, notes, outcome
- createdAt
```

### Phase 3: Integrate Your AI Models
**Stub Implementation** (Until Jupyter notebooks ready):
- Create `src/services/aiAnalysisService.js`
- Define interface for model calls
- Mock responses for testing
- Later: Replace with actual Jupyter model API calls

---

## 📝 COMPLETE ENDPOINT ROADMAP

### ✅ Authentication Endpoints (Existing - needs fixing)
```
POST   /api/v1/auth/register          - Register new user
POST   /api/v1/auth/login             - User login
POST   /api/v1/auth/refresh           - Refresh access token (NEW)
POST   /api/v1/auth/logout            - User logout (NEW)
GET    /api/v1/auth/profile           - Get user profile (NEW)
```

### 👤 Patient Endpoints (NEW)
```
GET    /api/v1/patients/profile       - Get patient profile
PUT    /api/v1/patients/profile       - Update patient profile
GET    /api/v1/patients/appointments  - Get patient appointments
GET    /api/v1/patients/files         - Get patient files
GET    /api/v1/patients/medical-history - Get medical history
```

### 👨‍⚕️ Doctor Endpoints (NEW)
```
GET    /api/v1/doctors/profile        - Get doctor profile
PUT    /api/v1/doctors/profile        - Update doctor profile
GET    /api/v1/doctors/appointments   - Get doctor appointments
GET    /api/v1/doctors/patients       - Get doctor's patients
GET    /api/v1/doctors/availability   - Get doctor availability
POST   /api/v1/doctors/availability   - Set doctor availability (NEW)
```

### 📅 Appointment Endpoints (NEW)
```
POST   /api/v1/appointments           - Book appointment
GET    /api/v1/appointments           - Get appointments (with filters)
GET    /api/v1/appointments/:id       - Get appointment by ID
PUT    /api/v1/appointments/:id       - Update appointment
POST   /api/v1/appointments/:id/cancel - Cancel appointment
```

### 📁 File Management Endpoints (Refactor existing)
```
POST   /api/v1/files/upload           - Upload medical file
GET    /api/v1/files                  - Get files (with pagination)
GET    /api/v1/files/:id              - Get file by ID
GET    /api/v1/files/:id/download     - Download file
DELETE /api/v1/files/:id              - Delete file (NEW)
POST   /api/v1/files/:id/analyze      - Request AI analysis
```

### 🤖 AI Analysis Endpoints (NEW - Ready for Jupyter integration)
```
POST   /api/v1/ai/analyze             - Request AI analysis
GET    /api/v1/ai/analyses            - Get AI analyses
GET    /api/v1/ai/analyses/:id        - Get analysis by ID
GET    /api/v1/ai/analyses/:id/results - Get analysis results
```

---

## 📊 IMPLEMENTATION PRIORITY

### **Critical (Week 1)** 🔴
1. Fix auth middleware bug
2. Add API v1 versioning
3. Create Appointment & Doctor models
4. Implement basic appointment CRUD

### **High (Week 2)** 🟠
5. Create appointment controller
6. Add doctor endpoints
7. Create all validators
8. Fix file upload to use MongoDB

### **Medium (Week 3)** 🟡
9. Add AI analysis endpoints (with stubs)
10. Implement doctor availability
11. Add pagination/filtering
12. Create comprehensive error handling

### **Integration (Ongoing)** 🟢
13. Connect to Jupyter notebook AI models
14. Set up async job queue for long-running analyses
15. Add webhook callbacks for analysis completion
16. Implement analysis result caching

---

## 🔄 AI MODEL INTEGRATION STRATEGY

### Current State (Your Team)
- Models developed in Jupyter notebooks
- Need to be converted to API-callable services

### Implementation Plan
1. **Create AI Service Adapter** (`src/services/aiAnalysisService.js`)
   ```javascript
   // Interface design:
   - analyzeXRay(fileBuffer, patientData) -> Promise<AnalysisResult>
   - analyzeMRI(fileBuffer, patientData) -> Promise<AnalysisResult>
   - predictFracture(imageData) -> Promise<Prediction>
   ```

2. **Async Job Queue** (Consider Bull + Redis later)
   - Queue analysis requests
   - Store results in AiReport
   - Send notifications when ready

3. **Gradual Integration**
   - Phase 1: Mock responses from stubs
   - Phase 2: HTTP calls to Jupyter server
   - Phase 3: Model containerization (Docker)
   - Phase 4: Kubernetes deployment

4. **Data Flow Example**
   ```
   Client → /api/v1/files/analyze 
        → Store file + create Job
        → AI Service processes (sync or async)
        → Store AiReport
        → Return analysis to client
   ```

---

## 🛠️ NEXT STEPS (ACTION ITEMS)

### Immediate (Before starting implementation):
- [ ] Review and approve this analysis
- [ ] Decide on async job queue (Bull, RabbitMQ, or simple?)
- [ ] Finalize doctor specialty options
- [ ] Define appointment time slot logic (fixed slots vs flexible?)
- [ ] Confirm AI model output JSON schema

### Quick Wins (Do first):
1. Fix auth middleware bug
2. Restructure `server.js` for v1 routing
3. Create Appointment & Doctor models
4. Create core validators

### Then:
4. Implement appointment controller
5. Create doctor profiles controller
6. Build all new routes
7. Add comprehensive tests

---

## 📦 Database Schema Overview

```
Users
├── patient (ref: Patient)
├── doctor (ref: Doctor) 
└── admin

Patients
├── user (ref: User)
└── medical_history

Doctors
├── user (ref: User)
├── specialty
├── availability (ref: DoctorAvailability[])
└── patients (ref: User[])

Appointments
├── patient (ref: User)
├── doctor (ref: User)
├── scheduledDate
└── status

MedicalFiles
├── patient (ref: Patient)
├── uploader (ref: User)
└── originalName, mimeType, path

AiReports
├── patient (ref: Patient)
├── file (ref: MedicalFile)
├── model_name
└── output_json
```

---

## 🎓 Recommendations

1. **Code Quality**: Add ESLint + Prettier
2. **Testing**: Add Jest for unit tests (especially AI analysis stubs)
3. **Validation**: Create centralized validation schemas (Joi or Zod)
4. **API Docs**: Add Swagger/OpenAPI documentation
5. **Monitoring**: Add APM (Sentry, LogRocket)
6. **Rate Limiting**: Add express-rate-limit
7. **Caching**: Consider Redis for doctor availability
8. **Pagination**: Standardize pagination params across all GET endpoints

---

**Status**: Ready for implementation 🚀
