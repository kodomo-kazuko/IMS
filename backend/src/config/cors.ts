// corsConfig.ts
import type cors from "cors";

const configureCors = (
	env: string,
): cors.CorsOptions | cors.CorsOptionsDelegate => {
	if (env === "production") {
		return {
			origin: process.env.CORS_ORIGIN || "https://your-production-domain.com",
			optionsSuccessStatus: 200,
		};
	}
	if (env === "staging") {
		return {
			origin: process.env.CORS_ORIGIN || "https://your-staging-domain.com",
			optionsSuccessStatus: 200,
		};
	}
	return {};
};

export default configureCors;
