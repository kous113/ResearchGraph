
import express from "express";

import {
  createPaper,
  getAllPapers,
  getPaperById,
  deletePaper,
  generatePaperRelationships,
  getPaperRelationships
} from "../repositories/paperRepository.js";

const router = express.Router();

// Save a paper and its AI analysis.
router.post("/papers", async (req, res) => {
  try {
    const { userId, title, fileName, totalPages, analysis } = req.body;

    if (!userId || !title || !fileName || !analysis) {
      return res.status(400).json({
        success: false,
        message: "Missing required paper information."
      });
    }

    const paper = await createPaper(
      Number(userId),
      title,
      fileName,
      totalPages,
      analysis
    );

    return res.status(201).json({
      success: true,
      message: "Paper saved successfully.",
      paper
    });
  } catch (error) {
    console.error("Save paper error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save paper."
    });
  }
});

// Get all papers belonging to a user.
router.get("/papers", async (req, res) => {
  try {
    const userId = Number(req.query.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid userId is required."
      });
    }

    const papers = await getAllPapers(userId);

    return res.status(200).json({
      success: true,
      count: papers.length,
      papers
    });
  } catch (error) {
    console.error("Get papers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve papers."
    });
  }
});

// Get a single paper by ID.
router.get("/papers/:id", async (req, res) => {
  try {
    const paperId = Number(req.params.id);
    const userId = Number(req.query.userId);

    if (
      !Number.isInteger(paperId) || paperId <= 0 ||
      !Number.isInteger(userId) || userId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid paperId and userId are required."
      });
    }

    const paper = await getPaperById(paperId, userId);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found."
      });
    }

    return res.status(200).json({
      success: true,
      paper
    });
  } catch (error) {
    console.error("Get paper error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve paper."
    });
  }
});

// Delete a paper.
router.delete("/papers/:id", async (req, res) => {
  try {
    const paperId = Number(req.params.id);
    const userId = Number(req.query.userId);

    if (
      !Number.isInteger(paperId) || paperId <= 0 ||
      !Number.isInteger(userId) || userId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid paperId and userId are required."
      });
    }

    const paper = await deletePaper(paperId, userId);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Paper deleted successfully.",
      paper
    });
  } catch (error) {
    console.error("Delete paper error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete paper."
    });
  }
});

// Generate relationships between all papers belonging to a user.
router.post("/paper-relationships/generate", async (req, res) => {
  try {
    const userId = Number(req.body.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid userId is required."
      });
    }

    const result = await generatePaperRelationships(userId);

    return res.status(200).json({
      success: true,
      message: "Paper relationships generated successfully.",
      ...result
    });
  } catch (error) {
    console.error("Generate relationships error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate paper relationships."
    });
  }
});

// Get saved relationships for the Research Graph.
router.get("/paper-relationships", async (req, res) => {
  try {
    const userId = Number(req.query.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid userId is required."
      });
    }

    const relationships = await getPaperRelationships(userId);

    return res.status(200).json({
      success: true,
      count: relationships.length,
      relationships
    });
  } catch (error) {
    console.error("Get relationships error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve paper relationships."
    });
  }
});

export default router;
