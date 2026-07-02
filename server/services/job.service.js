const jobStore = require("../store/jobStore");

function appendLog(jobId, log) {
  const job = jobStore.get(jobId);
  if (!job) return;

  job.logs.push(log);
  jobStore.set(jobId, job);
}

module.exports = {
  appendLog
};