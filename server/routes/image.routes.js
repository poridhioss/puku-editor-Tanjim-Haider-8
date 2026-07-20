const express = require("express");

const router = express.Router();

const imageController =
require("../controllers/image.controller");

/**
 * @openapi
 * /api/image:
 *   post:
 *     summary: Store the final Docker image name for a job (called by the runner)
 *     tags: [Image]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jobId, imageName]
 *             properties:
 *               jobId:
 *                 type: string
 *               imageName:
 *                 type: string
 *                 example: tanjim100/my-app:1720953600000
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
    imageController.updateImage
);

module.exports = router;