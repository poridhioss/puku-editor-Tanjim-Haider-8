const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const jobRoutes = require("./routes/job.routes");
const logRoutes = require("./routes/log.routes");
const statusRoutes = require("./routes/status.routes");
const imageRoutes = require("./routes/image.routes");
const healthRoute = require("./routes/health.routes");
// Note: the Runner service serves its own Swagger UI at /docs.

const swaggerSpec = require("./docs/swagger");

// const deploymentRoutes = require("./routes/deployment.routes");


const app = express();

app.use(cors());
app.use(express.json());

/**
 * @openapi
 * /:
 *   get:
 *     summary: Root greeting
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Plain text greeting from the server.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello from Mini GitHub Action Server!
 */
app.get("/", (req, res) => {
  res.send("Hello from Mini GitHub Action Server!");
});

// Swagger UI + raw JSON spec
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api/jobs", jobRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/image", imageRoutes);
app.use("/health", healthRoute);
// app.use("/api/deployment", deploymentRoutes);

module.exports = app;