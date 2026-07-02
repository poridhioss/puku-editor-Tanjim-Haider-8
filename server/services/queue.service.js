const { Queue } = require("bullmq");
const connection = require("../config/redis");

const jobQueue = new Queue("build-queue", { connection });

async function addJobToQueue(job) {
  await jobQueue.add(
    "build", 
    job
    
  );
}

module.exports = {
  jobQueue,
  addJobToQueue
};