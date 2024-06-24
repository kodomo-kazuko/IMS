import Redis from "ioredis";

const createRedisClient = () => {
  return new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  });
};

export default createRedisClient;
