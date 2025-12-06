import { body } from "express-validator";

export const fileUploadValidator = [
  body("modality")
    .notEmpty().withMessage("Modality is required")
    .isIn(["X-ray", "CT", "MRI", "Ultrasound", "PDF", "DICOM"])
    .withMessage("Invalid modality"),

  body("part")
    .notEmpty().withMessage("Body part is required")
    .isString().withMessage("Part must be a string"),
];
