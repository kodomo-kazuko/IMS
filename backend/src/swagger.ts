const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const outputFile = "./swagger-output.json";
const routes = ["./src/server.ts"];

const doc = {
  host: "10.147.17.74:8080",
};

swaggerAutogen(outputFile, routes, doc);
