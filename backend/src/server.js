
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import uploadRoutes from "./routes/uploadRoutes.js";
import openaiRoutes from "./routes/openaiRoutes.js";
import paperRoutes from "./routes/paperRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import { testDatabaseConnection } from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api", openaiRoutes);
app.use("/api", paperRoutes);

app.get("/", (req, res) => {
  res.send("ResearchGraph API is running!");
});

const PORT = process.env.PORT || 8000;

testDatabaseConnection();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
