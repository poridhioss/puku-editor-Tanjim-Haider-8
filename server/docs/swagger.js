const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Mini GitHub Action API",
      version: "1.0.0",
      description:
        "REST API for the self-hosted Mini GitHub Action CI platform. " +
        "Provides endpoints to create and inspect build jobs, accept " +
        "log/status/image callbacks from the runner, proxy requests to the " +
        "runner service, and report service health."
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Local development"
      }
    ],
    components: {
      schemas: {
        Job: {
          type: "object",
          properties: {
            id: { type: "string", example: "1720953600000" },
            repoUrl: {
              type: "string",
              example: "https://github.com/octocat/Hello-World.git"
            },
            branch: { type: "string", example: "main" },
            status: {
              type: "string",
              enum: ["queued", "running", "success", "failed"],
              example: "queued"
            },
            logs: {
              type: "array",
              items: { type: "string" }
            },
            imageName: {
              type: "string",
              nullable: true,
              example: "tanjim100/my-app:1720953600000"
            }
          }
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true }
          }
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "healthy" },
            service: { type: "string", example: "ci-server" },
            uptime: { type: "number", example: 12.34 },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2025-07-20T10:00:00.000Z"
            }
          }
        }
      }
    }
  },
  // Scan all route files for JSDoc @openapi blocks.
  apis: ["./routes/*.js", "./app.js"]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
