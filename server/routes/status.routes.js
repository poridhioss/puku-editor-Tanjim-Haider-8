const express = require("express");

const router = express.Router();

const statusController =
require("../controllers/status.controller");

router.post(
  "/",
  statusController.updateStatus
);

module.exports = router;