
import express from "express";
import multer from "multer";
import { createRequire } from "module";

import authenticateToken from "../middleware/authMiddleware.js";
import { analyzeResearchPaper } from "../services/openaiService.js";

import {
  createPaper,
  generatePaperRelationships
} from "../repositories/paperRepository.js";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" &&
      file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  }
});

// Extract PDF text.
router.post(
  "/upload-pdf",
  authenticateToken,
  upload.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a PDF file."
        });
      }

      const data = await pdf(req.file.buffer);
      const extractedText = data.text.trim();

      if (!extractedText) {
        return res.status(422).json({
          success: false,
          message: "No readable text found in this PDF."
        });
      }

      return res.status(200).json({
        success: true,
        message: "PDF uploaded and text extracted successfully.",
        fileName: req.file.originalname,
        totalPages: data.numpages,
        extractedText
      });
    } catch (error) {
      console.error("PDF extraction error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to extract text from PDF."
      });
    }
  }
);

// Analyse, save and generate relationships.
router.post(
  "/analyze-paper",
  authenticateToken,
  upload.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a PDF file."
        });
      }

      // Identity comes from the verified JWT, not the request body.
      const userId = req.user.id;

      const data = await pdf(req.file.buffer);
      const extractedText = data.text.trim();

      console.log("PDF file size:", req.file.size, "bytes");
      console.log("Extracted text length:", extractedText.length, "characters");

      const MAX_TEXT_LENGTH = 100000;

      if (!extractedText) {
        return res.status(422).json({
          success: false,
          message: "No readable text found in this PDF."
        });
      }

      if (extractedText.length > MAX_TEXT_LENGTH) {
        return res.status(413).json({
          success: false,
          message: "PDF is too large for single-request analysis.",
          maximumCharacters: MAX_TEXT_LENGTH,
          extractedCharacters: extractedText.length
        });
      }

      const analysis = await analyzeResearchPaper(extractedText);

      const paper = await createPaper(
        userId,
        analysis.title || req.file.originalname,
        req.file.originalname,
        data.numpages,
        analysis
      );

      let relationshipResult = null;

      try {
        relationshipResult = await generatePaperRelationships(userId);
      } catch (relationshipError) {
        console.error(
          "Automatic relationship generation error:",
          relationshipError
        );
      }

      return res.status(200).json({
        success: true,
        message: "Research paper analysed and saved successfully.",
        paper,
        analysis,
        relationships: relationshipResult
      });
    } catch (error) {
      console.error("Paper analysis error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to analyse and save research paper.",
        error: error.message
      });
    }
  }
);

export default router;
