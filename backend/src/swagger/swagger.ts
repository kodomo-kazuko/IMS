const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const outputFile = "./swagger-output.json";
const routes = ["./src/server.ts"];

const hosts = ["10.147.17.74:8080", "localhost:8080"];

const doc = {
	servers: [
		{
			url: "http://10.147.17.74:8080/",
		},
		{
			url: "http://localhost:8080/",
		},
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
			},
		},
	},
};

swaggerAutogen(outputFile, routes, doc);
