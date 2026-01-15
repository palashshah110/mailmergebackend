import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mailMergeRoutes from "./routes/mailMerge.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    "https://mailmerge.online",
    "https://www.mailmerge.online",
    "http://localhost:3000",
    "https://pranjalimailmerge.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
    res.send("✅ Backend is running");
  });
  
app.use("/mail-merge", mailMergeRoutes);

app.listen(process.env.PORT, () => {
  console.log(`✅ Backend running on port ${process.env.PORT}`);
});
