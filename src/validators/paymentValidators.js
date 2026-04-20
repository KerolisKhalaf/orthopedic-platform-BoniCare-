import { body, validationResult } from 'express-validator';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const createIntentValidator = [
    body('appointmentId').isMongoId().withMessage('Invalid appointment ID'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('type').optional().isIn(['full_payment', 'deposit']).withMessage('Invalid payment type'),
    validate
];

export const refundValidator = [
    body('paymentId').isMongoId().withMessage('Invalid payment ID'),
    body('amount').optional().isNumeric().withMessage('Amount must be a number'),
    validate
];
