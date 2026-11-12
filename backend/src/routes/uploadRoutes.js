import express from "express";
import multer from "multer";
import { createRequire } from "module";
import { analyzeResearchPaper } from "../services/openaiService.js";
import { createPaper } from "../repositories/paperRepository.js";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const router = express.Router();

// Store uploaded PDF temporarily in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
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
  },
});

// Upload and extract PDF text
router.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file.",
      });
    }

    const data = await pdf(req.file.buffer);

    const extractedText = data.text.trim();

    if (!extractedText) {
      return res.status(422).json({
        success: false,
        message: "No readable text found in this PDF.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "PDF uploaded and text extracted successfully.",
      fileName: req.file.originalname,
      totalPages: data.numpages,
      extractedText,
    });
  } catch (error) {
    console.error("PDF extraction error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to extract text from PDF.",
    });
  }
});


router.post("/analyze-paper", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file.",
      });
    }

    const userId = Number(req.body.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid userId is required.",
      });
    }

    const data = await pdf(req.file.buffer);
    const extractedText = data.text.trim();

    const MAX_TEXT_LENGTH = 30000;

    if (extractedText.length > MAX_TEXT_LENGTH) {
      return res.status(413).json({
        success: false,
        message: "PDF is too large for single-request analysis.",
        maximumCharacters: MAX_TEXT_LENGTH,
        extractedCharacters: extractedText.length,
      });
    }

    if (!extractedText) {
      return res.status(422).json({
        success: false,
        message: "No readable text found in this PDF.",
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

    return res.status(200).json({
      success: true,
      message: "Research paper analysed and saved successfully.",
      paper,
      analysis,
    });

  } catch (error) {
    console.error("Paper analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyse and save research paper.",
      error: error.message,
    });
  }
});


export default router;
