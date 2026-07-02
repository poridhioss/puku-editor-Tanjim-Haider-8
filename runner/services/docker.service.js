const { spawn } = require("child_process");
const { sendLog } = require("./log.service");

function getRepoName(repoUrl) {
  return repoUrl
    .split("/")
    .pop()
    .replace(".git", "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-");
}

function streamLogs(jobId, data) {

  const lines = data
    .toString()
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  for (const line of lines) {
    sendLog(jobId, line);
  }

}

async function buildImage(job, repoPath) {

  const repoName = getRepoName(job.repoUrl);

  const imageName =
    `${process.env.DOCKER_USERNAME}/${repoName}:${job.jobId}`;

  return new Promise((resolve, reject) => {

    sendLog(
      job.jobId,
      `🐳 Building Docker image ${imageName}`
    );

    const process = spawn(
      "docker",
      [
        "build",
        "-t",
        imageName,
        "."
      ],
      {
        cwd: repoPath
      }
    );

    process.stdout.on("data", (data) => {
      streamLogs(job.jobId, data);
    });

    process.stderr.on("data", (data) => {
      streamLogs(job.jobId, data);
    });

    process.on("error", (err) => {

      sendLog(
        job.jobId,
        `❌ Failed to start docker build: ${err.message}`
      );

      reject(err);

    });

    process.on("close", (code) => {

      if (code === 0) {

        sendLog(
          job.jobId,
          "✅ Docker image built successfully"
        );

        resolve(imageName);

      } else {

        sendLog(
          job.jobId,
          `❌ Docker build exited with code ${code}`
        );

        reject(
          new Error(
            `Docker build failed with exit code ${code}`
          )
        );

      }

    });

  });

}

module.exports = {
  buildImage
};