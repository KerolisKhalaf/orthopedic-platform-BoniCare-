import express from 'express';
import { createPaymentIntent, handleWebhook, issueRefund } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { createIntentValidator, refundValidator } from '../validators/paymentValidators.js';

const router = express.Router();

// T013: Create intent
router.post('/create-intent', protect(['patient']), createIntentValidator, createPaymentIntent);

// T019: Webhook (Note: handleWebhook needs raw body, see below)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// T023: Refund
router.post('/refund', protect(['admin', 'doctor']), refundValidator, issueRefund);

export default router;
