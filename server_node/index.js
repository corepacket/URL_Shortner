import express from "express";
import cors from "cors";
import "dotenv/config";

import connectToMongo from "./src/config/mongo.config.js";
import shortUrlRouter from "./src/routes/shortUrl.route.js";
import authRouter from "./src/routes/auth.route.js";
import getAllRouter from "./src/routes/getAll.route.js";
import connectToRedis from './src/cache/redisClient.js';
import rateLimiter from "./src/middleware/ratelimiter.js";

const app = express();
app.set("trust proxy", 1);

const clientUrls = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  ...clientUrls,
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(cleanOrigin) || process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Healthy",
    instance: process.env.INSTANCE_NAME || "Render-Server",
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  const url = process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`;
  res.send(`
    <h1>Welcome to URL Shortener API</h1>
    <p>Instance: ${process.env.INSTANCE_NAME || 'Default Server'}</p>
    <p>App URL: ${url}</p>
  `);
});

app.use("/api/generate-id", rateLimiter(10, 60), shortUrlRouter);
app.use("/", shortUrlRouter);
app.use("/auth", rateLimiter(10, 60), authRouter);
app.use("/api/", rateLimiter(10, 60), getAllRouter);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToMongo();
    await connectToRedis();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server (${process.env.INSTANCE_NAME || "Render-Server"}) running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message || error);
    process.exit(1);
  }
};

startServer();
