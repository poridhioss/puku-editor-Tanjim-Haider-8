const express = require("express");
const swaggerUi = require("swagger-ui-express");

const executeRoutes = require("./routes/execute.routes");
const swaggerSpec = require("./docs/swagger");

const app = express();

app.use(express.json());

/**
 * @openapi
 * /:
 *   get:
 *     summary: Runner root greeting
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Plain text greeting from the runner.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Runner is running very fast.
 */
app.get("/", (req, res) => {
  res.send("Runner is running very fast.");
});

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Runner health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Runner is healthy.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "runner",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Swagger UI + raw JSON spec for the runner.
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/execute", executeRoutes);

app.listen(7000, () => {
  console.log("Runner started on port 7000");
});