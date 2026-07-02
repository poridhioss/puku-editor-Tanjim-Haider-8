const { spawn } = require("child_process");
const { sendLog } = require("./log.service");
const dockerProcess = require("process");

function runDockerCommand(args, jobId) {
  return new Promise((resolve, reject) => {

    const dockerProcess = spawn(
      "docker",
      args,
      {
        stdio: [
          "pipe",
          "pipe",
          "pipe"
        ]
      }
    );

    dockerProcess.stdout.on("data", (data) => {
      sendLog(jobId, data.toString());
    });

    dockerProcess.stderr.on("data", (data) => {
      sendLog(jobId, data.toString());
    });

    dockerProcess.on("error", reject);

    dockerProcess.on("close", (code) => {

      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `docker ${args[0]} failed`
          )
        );
      }

    });

  });
}

async function login(jobId) {

  sendLog(jobId, "🔐 Logging into Docker Hub...");

  if (!process.env.DOCKER_USERNAME)
    throw new Error("DOCKER_USERNAME missing");

  if (!process.env.DOCKER_ACCESS_TOKEN)
    throw new Error("DOCKER_ACCESS_TOKEN missing");

  return new Promise((resolve, reject) => {

    const dockerProcess = spawn(
      "docker",
      [
        "login",
        "-u",
        process.env.DOCKER_USERNAME,
        "--password-stdin"
      ]
    );

    dockerProcess.stdin.write(
      process.env.DOCKER_ACCESS_TOKEN + "\n"
    );

    dockerProcess.stdin.end();

    dockerProcess.stdout.on("data", (data) => {
      sendLog(jobId, data.toString());
    });

    dockerProcess.stderr.on("data", (data) => {
      sendLog(jobId, data.toString());
    });

    dockerProcess.on("error", reject);

    dockerProcess.on("close", (code) => {

      if (code === 0) {

        sendLog(jobId, "✅ Docker login successful");
        resolve();

      } else {

        reject(new Error("Docker login failed"));

      }

    });

  });

}

async function logout(jobId) {

  sendLog(
    jobId,
    "🚪 Logging out from Docker Hub..."
  );

  await runDockerCommand(
    ["logout"],
    jobId
  );

}

module.exports = {
  login,
  logout
};