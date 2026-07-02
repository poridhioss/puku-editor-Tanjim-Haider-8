const jobStore = require("../store/jobStore");
const { emitLog } = require("../socket/socket");

exports.addLog = (req, res) => {
  const { jobId, message } = req.body;

  const job = jobStore.get(jobId);

  if (job) {
    job.logs.push(message);

    emitLog(jobId, message);
  }

  res.json({ success: true });
};