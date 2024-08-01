import Redis from "ioredis";

const createRedisClient = () => {
	const redisClient = new Redis({
		host: process.env.REDIS_HOST || "localhost",
		port: Number.parseInt(process.env.REDIS_PORT || "6379", 10),
	});

	redisClient.on("connect", () => {
		console.log("Redis client connected");
	});

	redisClient.on("error", (err) => {
		console.log("Error connecting to Redis:", err);
	});

	return redisClient;
};

export default createRedisClient;
