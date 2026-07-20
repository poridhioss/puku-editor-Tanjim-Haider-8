const express = require("express");
const router = express.Router();

const logController = require("../controllers/log.controller");

/**
 * @openapi
 * /api/logs:
 *   post:
 *     summary: Append a log line to a job (called by the runner)
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jobId, message]
 *             properties:
 *               jobId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Acknowledgement.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post("/", logController.addLog);

module.exports = router;