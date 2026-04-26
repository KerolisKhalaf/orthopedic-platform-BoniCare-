# 🚀 BoniCare Quickstart Guide

This guide will help you get the BoniCare Orthopedic Platform running on your local machine for development and testing.

## 📋 Prerequisites

Ensure you have the following installed:
- **Node.js**: v20.x or higher
- **MongoDB**: v7.x or higher (Running locally or via Atlas)
- **Redis**: v7.x or higher (Required for Chat & Real-time features)
- **Stripe CLI**: (Optional, required for local webhook testing)
- **Git**: For version control

---

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/KerolisKhalaf/orthopedic-platform-BoniCare-.git
cd orthopedic-platform-BoniCare-
```

### 2. Install Dependencies
```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and populate it with the following keys. You can refer to `.env.example` for a complete list.

### Mandatory Configuration
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://127.0.0.1:27017/bonicare

# JWT
JWT_SECRET=your_jwt_secret_at_least_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_at_least_32_chars
```

### Feature-Specific Configuration

#### 💳 Stripe (Payments)
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYMENT_CURRENCY=usd
```

#### 💬 Redis (Real-time Chat)
```env
REDIS_URL=redis://127.0.0.1:6379
```

#### 🔔 Firebase (Notifications)
```env
FIREBASE_SERVICE_ACCOUNT_PATH=../../src/config/firebase-adminsdk.json
```

---

## 🚀 Running the Project

### 1. Seed the Database
Populate your local database with professional orthopedic demo data:
```bash
npm run seed
```

### 2. Start in Development Mode
```bash
npm run dev
```
The server will be available at `http://localhost:3000`.

---

## 🧪 Testing Webhooks Locally

To test the end-to-end payment flow including asynchronous status updates, use the Stripe CLI:

1. **Start the Stripe Listener**:
```bash
stripe listen --forward-to localhost:3000/api/v1/payment/webhook
```
2. **Update `.env`**: Copy the `whsec_...` secret printed by the CLI into your `STRIPE_WEBHOOK_SECRET` variable.

---

## 👤 Demo Credentials

Use these pre-seeded accounts to test different roles:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@bonicare.com` | `Admin@123456` |
| **Doctor** | `dr.ahmed@bonicare.com` | `Doctor@123456` |
| **Patient** | `patient.kerolis@gmail.com` | `Patient@123456` |

> **Note**: For Stripe payments, use the test card number `4242 4242 4242 4242` with any future expiry date.

---

## 📚 Documentation & API

- **Swagger UI**: `http://localhost:3000/api-docs`
- **Postman**: Collections are available in the `postman/` directory.
