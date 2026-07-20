const express = require("express");

const router = express.Router();

const healthController =
require("../controllers/health.controller");

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Service health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Health payload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get(
  "/",
  healthController.health
);

module.exports = router;