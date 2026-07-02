const { addJobToQueue } = require("../services/queue.service");
const jobStore = require("../store/jobStore");

exports.createJob = async (req, res) => {
  const { repoUrl, branch } = req.body;

  const job = {
    id: Date.now().toString(),
    repoUrl,
    branch,
    status: "queued",
    logs: [],
    imageName:null
    
  };
  console.log("Creating job:", job);

  jobStore.set(job.id, job);

  await addJobToQueue(job);

  res.json(job);
};

exports.getJob = (req, res) => {
  const job = jobStore.get(req.params.id);
  res.json(job || {});
};