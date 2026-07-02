const express = require("express");

const executeRoutes = require("./routes/execute.routes");

const app = express();

app.use(express.json());

app.use("/execute", executeRoutes);

app.listen(7000, () => {
  console.log("Runner started on port 7000");
});