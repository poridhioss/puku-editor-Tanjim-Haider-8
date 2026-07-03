const express = require("express");

const router = express.Router();

const { executeJob } = require("../controllers/execute.controller");

router.post("/", executeJob);

module.exports = router;