import { body, param } from "express-validator";
import { DAYS_OF_WEEK } from "../config/constants.js";

export const updateProfileValidator = [
  body("specialty")
    .notEmpty().withMessage("Specialty is required"),
  body("bio")
    .notEmpty().withMessage("Bio is required")
    .isLength({ min: 10 }).withMessage("Bio must be at least 10 characters"),
  body("licenseNumber")
    .notEmpty().withMessage("License number is required"),
  body("yearsOfExperience")
    .notEmpty().withMessage("Years of experience is required")
    .isNumeric().withMessage("Years of experience must be a number"),
  body("hospitalInfo")
    .optional()
    .isString().withMessage("Hospital info must be a string"),
];

export const availabilityValidator = [
  body("dayOfWeek")
    .notEmpty().withMessage("Day of week is required")
    .isIn(DAYS_OF_WEEK).withMessage(`Day of week must be one of: ${DAYS_OF_WEEK.join(", ")}`),
  body("startTime")
    .notEmpty().withMessage("Start time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Start time must be in HH:mm format"),
  body("endTime")
    .notEmpty().withMessage("End time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("End time must be in HH:mm format"),
];
