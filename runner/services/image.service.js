const { spawn } = require("child_process");
const { sendLog } = require("./log.service");

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

async function pushImage(jobId, imageName) {

  return new Promise((resolve, reject) => {

    sendLog(
      jobId,
      `📤 Pushing Docker image ${imageName}`
    );

    const process = spawn(
      "docker",
      [
        "push",
        imageName
      ]
    );

    process.stdout.on("data", (data) => {
      streamLogs(jobId, data);
    });

    process.stderr.on("data", (data) => {
      streamLogs(jobId, data);
    });

    process.on("error", (err) => {

      sendLog(
        jobId,
        `❌ Failed to start docker push: ${err.message}`
      );

      reject(err);

    });

    process.on("close", (code) => {

      if (code === 0) {

        sendLog(
          jobId,
          "✅ Docker image pushed successfully"
        );

        resolve();

      } else {

        sendLog(
          jobId,
          `❌ Docker push exited with code ${code}`
        );

        reject(
          new Error(
            `Docker push failed with exit code ${code}`
          )
        );

      }

    });

  });

}

module.exports = {
  pushImage
};