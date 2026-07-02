const { Worker } = require("bullmq");

const connection = require("./queue/connections");
const buildProcessor = require("./processors/buildProcessor");

const worker = new Worker(
  "build-queue",
  buildProcessor,
  {
    connection
  }
);

worker.on("completed", (job) => {
  console.log(
    `Job ${job.id} completed`
  );
});

worker.on("failed", (job, err) => {
  console.log(
    `Job ${job?.id} failed`
  );

  console.error(err);
});

console.log("Worker started...");