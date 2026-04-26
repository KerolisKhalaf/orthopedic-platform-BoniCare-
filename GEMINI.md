# backend Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-26

## Active Technologies
- Node.js (v20+), ES6 modules + Express.js (v5.1), Mongoose (v8.19), express-validator (v7.3) (001-appointment-models)
- MongoDB (001-appointment-models)
- Node.js (v18+ or current project version) + Mongoose, Express (existing) (001-appointment-models)
- MongoDB (Mongoose) (001-appointment-models)
- Node.js v20+, ES6 Modules + `mongoose`, `@faker-js/faker`, `bcrypt` (005-database-seeding)
- [if applicable, e.g., PostgreSQL, CoreData, files or N/A] (006-openapi-spec)
- Node.js (v20+) + Express.js, Mongoose, Stripe SDK (latest) (009-stripe-payment-integration)
- Node.js v20 (Backend), Angular (Frontend) + Express.js, Mongoose, Nginx, Prometheus, Loki, Grafana, Certbot (011-containerize-bonicare)
- MongoDB (Docker Volumes), Redis (011-containerize-bonicare)
- Node.js (ES6 modules) + Stripe SDK, Redis (ioredis), Firebase Admin SDK (012-update-repo-docs)
- MongoDB, Redis (012-update-repo-docs)

- [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION] + [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION] (001-appointment-models)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

cd src; pytest; ruff check .

## Code Style

[e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]: Follow standard conventions

## Recent Changes
- 012-update-repo-docs: Added Node.js (ES6 modules) + Stripe SDK, Redis (ioredis), Firebase Admin SDK
- 011-containerize-bonicare: Added Node.js v20 (Backend), Angular (Frontend) + Express.js, Mongoose, Nginx, Prometheus, Loki, Grafana, Certbot
- 009-stripe-payment-integration: Added Node.js (v20+) + Express.js, Mongoose, Stripe SDK (latest)


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
