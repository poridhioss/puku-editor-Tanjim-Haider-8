const express = require("express");

const router = express.Router();

const { executeJob } = require("../controllers/execute.controller");

/**
 * @openapi
 * /execute:
 *   post:
 *     summary: Trigger a CI build on the runner
 *     description: |
 *       Clones the repo, builds the Docker image, pushes it to the configured
 *       registry, and reports logs/status/images back to the server.
 *     tags: [Execute]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExecuteJobRequest'
 *     responses:
 *       200:
 *         description: Execution accepted. The runner responds immediately and continues building asynchronously.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExecuteJobAccepted'
 *       500:
 *         description: Server error during execution.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/", executeJob);

module.exports = router;