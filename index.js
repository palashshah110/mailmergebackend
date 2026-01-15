import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mailMergeRoutes from "./routes/mailMerge.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://mailmerge.online",
  "https://www.mailmerge.online",
  "http://localhost:3000",
  "https://pranjalimailmerge.netlify.app/"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser requests (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
    res.send("✅ Backend is running");
  });
  
app.use("/mail-merge", mailMergeRoutes);

app.listen(process.env.PORT, () => {
  console.log(`✅ Backend running on port ${process.env.PORT}`);
});
