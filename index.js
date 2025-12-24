import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mailMergeRoutes from "./routes/mailMerge.js";

dotenv.config();

const app = express();

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
    res.send("✅ Backend is running");
  });
  
app.use("/mail-merge", mailMergeRoutes);

app.listen(process.env.PORT, () => {
  console.log(`✅ Backend running on port ${process.env.PORT}`);
});
