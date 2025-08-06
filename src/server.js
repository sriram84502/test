import express from "express";
import dotenv  from "dotenv";
import helmet  from "helmet";
import cors    from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan  from "morgan";

import { connectDB }       from "./config/db.js";
import { errorHandler }    from "./middleware/errorHandler.js";

import uploadRoutes from "./routes/upload.routes.js";
import authRoutes   from "./routes/auth.routes.js";
import userRoutes   from "./routes/user.routes.js";
import adminRoutes  from "./routes/admin.routes.js";

dotenv.config();
await connectDB();

const app = express();

/* ────────────────────────────
   Global middle-ware
   ──────────────────────────── */
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

/* ────────────────────────────
   Rate-limit: 100 req / minute
   BUT we’ll exempt uploads.
   ──────────────────────────── */
const generalLimiter = rateLimit({
  windowMs: 60_000,
  max: 100,
});

/* ────────────────────────────
   ROUTES
   ──────────────────────────── */

/* 1️⃣  Uploads first → NO limiter */
app.use("/api/uploads", uploadRoutes);

/* 2️⃣  Apply limiter to every other /api route */
app.use("/api", generalLimiter);

/* 3️⃣  All remaining routers inherit the limiter   */
app.use("/api/auth",  authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

/* ────────────────────────────
   Block any direct hit to /uploads/*
   (legacy static path is now closed)
   ──────────────────────────── */
app.all(/^\/uploads\/.*$/, (_req, res) => res.sendStatus(404));

/* ────────────────────────────
   Fallback + error handler
   ──────────────────────────── */
app.use((_, res) => res.sendStatus(404));
app.use(errorHandler);

/* ────────────────────────────
   Start server
   ──────────────────────────── */
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);