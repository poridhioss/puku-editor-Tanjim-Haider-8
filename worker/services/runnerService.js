const axios = require("axios");

async function assignToRunner(job) {
  console.log(
    `Assigning Job ${job.data.id} to runner`
  );

  await axios.post(
    `${process.env.RUNNER_URL}/execute`,
    {
      jobId: job.data.id,
      repoUrl: job.data.repoUrl,
      branch: job.data.branch
    }
  );
}

module.exports = {
  assignToRunner
};