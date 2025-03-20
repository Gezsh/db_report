import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbconnect from "./connect/db.js";
import ReportRoute from "./route/report_route.js";
import UserRouter from "./route/user_route.js";
import DbRouter from "./route/db_route.js"
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();
const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve static files for uploaded images
//app.use("/uploads", express.static(path.join("public/Images")));
app.use(express.static('public'))
// Routes
app.use("/api/report", ReportRoute);
app.use("/api/user", UserRouter);
app.use("/api/db",DbRouter)
// Connect to Database
dbconnect(process.env.MONGO_URL);

// Start Server
app.listen(5000, () => {
  console.log("🚀 Server is running on port 5000");
});
