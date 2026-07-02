const express = require("express");

const executeRoutes = require("./routes/execute.routes");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {

  res.status(200).json({
    status: "healthy",
    service: "runner",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });

});

app.use("/execute", executeRoutes);

app.listen(7000, () => {
  console.log("Runner started on port 7000");
});