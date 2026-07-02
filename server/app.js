const express = require("express");
const cors = require("cors");

const jobRoutes = require("./routes/job.routes");
const logRoutes = require("./routes/log.routes");
const statusRoutes = require("./routes/status.routes");
const imageRoutes = require("./routes/image.routes");
const healthRoute = require("./routes/health.routes");

// const deploymentRoutes = require("./routes/deployment.routes");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Mini GitHub Action Server!");
});

app.use("/api/jobs", jobRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/image", imageRoutes);
app.use("/health", healthRoute);
// app.use("/api/deployment", deploymentRoutes);

module.exports = app;