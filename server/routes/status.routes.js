const express = require("express");

const router = express.Router();

const statusController =
require("../controllers/status.controller");

/**
 * @openapi
 * /api/status:
 *   post:
 *     summary: Update a job's status (called by the runner)
 *     tags: [Status]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jobId, status]
 *             properties:
 *               jobId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [queued, running, success, failed]
 *     responses:
 *       200:
 *         description: Acknowledgement.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post(
  "/",
  statusController.updateStatus
);

module.exports = router;