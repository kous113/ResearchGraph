
import express from "express";

import authenticateToken from "../middleware/authMiddleware.js";

import {
  discoverResearchGaps,
  compareResearchPapers
} from "../services/openaiService.js";

import {
  createPaper,
  getAllPapers,
  getPaperById,
  deletePaper,
  generatePaperRelationships,
  getPaperRelationships,
  saveResearchGaps,
  getResearchGaps
} from "../repositories/paperRepository.js";

const router = express.Router();

// Every route in this file requires a valid JWT.
router.use(authenticateToken);

// Save a paper and its AI analysis.
router.post("/papers", async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, fileName, totalPages, analysis } = req.body;

    if (!title || !fileName || !analysis) {
      return res.status(400).json({
        success: false,
        message: "Missing required paper information."
      });
    }

    const paper = await createPaper(
      userId,
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

// Get all papers belonging to the logged-in user.
router.get("/papers", async (req, res) => {
  try {
    const papers = await getAllPapers(req.user.id);

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

// Get a single paper.
router.get("/papers/:id", async (req, res) => {
  try {
    const paperId = Number(req.params.id);

    if (!Number.isInteger(paperId) || paperId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid paper ID is required."
      });
    }

    const paper = await getPaperById(paperId, req.user.id);

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

    if (!Number.isInteger(paperId) || paperId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid paper ID is required."
      });
    }

    const paper = await deletePaper(paperId, req.user.id);

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

// Generate relationships.
router.post("/paper-relationships/generate", async (req, res) => {
  try {
    const result = await generatePaperRelationships(req.user.id);

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

// Get relationships.
router.get("/paper-relationships", async (req, res) => {
  try {
    const relationships = await getPaperRelationships(req.user.id);

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

// AI-powered comparison of 2–3 selected papers.
router.post("/compare-papers", async (req, res) => {
  try {
    const paperIds = req.body.paperIds;

    if (
      !Array.isArray(paperIds) ||
      paperIds.length < 2 ||
      paperIds.length > 3 ||
      paperIds.some(
        id => !Number.isInteger(Number(id)) || Number(id) <= 0
      ) ||
      new Set(paperIds.map(Number)).size !== paperIds.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Select 2 or 3 unique valid paper IDs."
      });
    }

    const papers = await Promise.all(
      paperIds.map(id => getPaperById(Number(id), req.user.id))
    );

    if (papers.some(paper => !paper)) {
      return res.status(404).json({
        success: false,
        message: "One or more selected papers were not found."
      });
    }

    const comparison = await compareResearchPapers(papers);

    return res.status(200).json({
      success: true,
      message: "AI paper comparison completed successfully.",
      comparison
    });
  } catch (error) {
    console.error("AI comparison error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to compare research papers.",
      error: error.message
    });
  }
});

// Discover and persist research gaps.
router.post("/research-gaps", async (req, res) => {
  try {
    const userId = req.user.id;
    const forceRefresh = req.body.forceRefresh === true;

    const papers = await getAllPapers(userId);
    const analysedPapers = papers.filter(paper => paper.analysis);

    if (analysedPapers.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 analysed papers are required."
      });
    }

    const sourcePaperIds = analysedPapers
      .map(paper => Number(paper.id))
      .sort((a, b) => a - b);

    const savedData = await getResearchGaps(userId);

    const savedPaperIds = savedData?.source_paper_ids
      ? [...savedData.source_paper_ids].map(Number).sort((a, b) => a - b)
      : [];

    const papersUnchanged =
      JSON.stringify(sourcePaperIds) === JSON.stringify(savedPaperIds);

    if (savedData && papersUnchanged && !forceRefresh) {
      return res.status(200).json({
        success: true,
        cached: true,
        count: savedData.gaps.length,
        gaps: savedData.gaps
      });
    }

    const gaps = await discoverResearchGaps(analysedPapers);

    await saveResearchGaps(userId, gaps, sourcePaperIds);

    return res.status(200).json({
      success: true,
      cached: false,
      count: gaps.length,
      gaps
    });
  } catch (error) {
    console.error("Research gap discovery error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to discover research gaps.",
      error: error.message
    });
  }
});

export default router;
