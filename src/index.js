import express from "express";
import dotenv from "dotenv";    
import connectDB from "./db/dbconnection.js";
import systemLogRoutes from "./routes/systemLog.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/system/log", systemLogRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running at port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB connection failed:", err));
