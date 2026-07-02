const { assignToRunner } = require("../services/runnerService");

async function buildProcessor(job) {
  console.log(
    `Processing Job: ${job.id}`
  );

  console.log("Repo:", job.data.repoUrl);

  await assignToRunner(job);

  return {
    success: true
  };
}

module.exports = buildProcessor;