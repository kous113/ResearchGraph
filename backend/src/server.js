import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoutes from "./routes/uploadRoutes.js";
import openaiRoutes from "./routes/openaiRoutes.js";
import { testDatabaseConnection } from "./config/db.js";
import paperRoutes from "./routes/paperRoutes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Upload routes
app.use("/api", uploadRoutes);
app.use("/api", openaiRoutes);
app.use("/api", paperRoutes);

app.get("/", (req, res) => {
  res.send("ResearchGraph API is running!");
});

const PORT = process.env.PORT || 5000;

testDatabaseConnection();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
