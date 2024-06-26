import Redis from "ioredis";

const createRedisClient = () => {
  const redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  });

  redisClient.on("connect", function () {
    console.log("Redis client connected");
  });

  redisClient.on("error", function (err) {
    console.log("Error connecting to Redis:", err);
  });

  return redisClient;
};

export default createRedisClient;
