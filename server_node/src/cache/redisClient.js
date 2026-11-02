import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({
  url: redisUrl || "redis://localhost:6379",
});

// Handle Redis errors to prevent unhandled process crashes
redisClient.on("error", (error) => {
  console.error("Redis client error:", error.message || error);
});

const connectToRedis = async () => {
  if (!process.env.REDIS_URL && process.env.NODE_ENV === "production") {
    throw new Error(
      "REDIS_URL is not configured. Please add the REDIS_URL environment variable in your Render dashboard."
    );
  }

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    console.log("Redis connected successfully");
  } catch (error) {
    console.error("Redis connection failed:", error.message || error);
    throw error;
  }
};

export { redisClient };
export default connectToRedis;
