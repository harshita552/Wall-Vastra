import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import envConfig from "./config/envConfig";

dotenv.config(".env");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = envConfig.port;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
