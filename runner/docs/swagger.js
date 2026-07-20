const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Mini GitHub Action Runner API",
      version: "1.0.0",
      description:
        "REST API for the Runner service of the self-hosted Mini GitHub " +
        "Action CI platform. The runner clones repositories, builds Docker " +
        "images, pushes them to the configured registry, and reports " +
        "logs/status/images back to the server."
    },
    servers: [
      {
        url: "http://localhost:7001",
        description: "Local development (host port — 7001:7000)"
      },
      {
        url: "http://runner:7000",
        description: "In-network (Docker Compose service URL)"
      }
    ],
    components: {
      schemas: {
        ExecuteJobRequest: {
          type: "object",
          required: ["jobId", "repoUrl", "branch"],
          properties: {
            jobId: {
              type: "string",
              description: "Unique identifier for the job.",
              example: "1720953600000"
            },
            repoUrl: {
              type: "string",
              description: "Git URL of the repository to clone.",
              example: "https://github.com/octocat/Hello-World.git"
            },
            branch: {
              type: "string",
              description: "Git branch or ref to check out.",
              example: "main"
            }
          }
        },
        ExecuteJobAccepted: {
          type: "object",
          properties: {
            accepted: { type: "boolean", example: true },
            jobId: { type: "string", example: "1720953600000" }
          }
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "healthy" },
            service: { type: "string", example: "runner" },
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
  // Scan all route files + the entrypoint for JSDoc @openapi blocks.
  apis: ["./routes/*.js", "./index.js"]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;