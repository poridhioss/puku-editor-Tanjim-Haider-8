const express = require("express");
const router = express.Router();

const jobController = require("../controllers/job.controller");

/**
 * @openapi
 * /api/jobs:
 *   post:
 *     summary: Create and queue a new CI job
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [repoUrl, branch]
 *             properties:
 *               repoUrl:
 *                 type: string
 *                 example: https://github.com/octocat/Hello-World.git
 *               branch:
 *                 type: string
 *                 example: main
 *     responses:
 *       200:
 *         description: The created job.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 */
router.post("/", jobController.createJob);

/**
 * @openapi
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The job, or an empty object if not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 */
router.get("/:id", jobController.getJob);

module.exports = router;