
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

// Handle Redis errors
redisClient.on("error", (error) => {
  console.error("Redis error:", error);
});

const connectToRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    console.log("Redis connected successfully");
  } catch (error) {
    console.error("Redis connection failed:", error);
    throw error;
  }
};

export { redisClient };
export default connectToRedis;
