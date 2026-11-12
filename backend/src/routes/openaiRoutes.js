
import express from "express";
import { testOpenAIConnection } from "../services/openaiService.js";

const router = express.Router();

router.get("/test-openai", async (req, res) => {
  try {
    const result = await testOpenAIConnection();

    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    console.error("OpenAI connection error:", error);

    res.status(500).json({
      success: false,
      message: "OpenAI connection failed.",
      error: error.message,
    });
  }
});

export default router;
