import { body, param } from "express-validator";

export const bookAppointmentValidator = [
  body("doctorId")
    .notEmpty().withMessage("Doctor ID is required")
    .isMongoId().withMessage("Invalid Doctor ID"),
  body("scheduledDate")
    .notEmpty().withMessage("Scheduled date is required")
    .isISO8601().withMessage("Invalid date format (must be ISO8601)"),
  body("startTime")
    .notEmpty().withMessage("Start time is required")
    .isISO8601().withMessage("Invalid date-time format for start time (must be ISO8601)"),
  body("endTime")
    .notEmpty().withMessage("End time is required")
    .isISO8601().withMessage("Invalid date-time format for end time (must be ISO8601)"),
  body("notes")
    .optional()
    .isString().withMessage("Notes must be a string"),
];

export const cancelAppointmentValidator = [
  param("id")
    .notEmpty().withMessage("Appointment ID is required")
    .isMongoId().withMessage("Invalid Appointment ID"),
];
