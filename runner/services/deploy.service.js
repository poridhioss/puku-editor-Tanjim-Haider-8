const { spawn } = require("child_process");

const { sendLog } = require("./log.service");

async function deployContainer(
  jobId,
  imageName
) {

  const containerName =
    `app-${jobId}`;

  const port =
    3000 +
    Math.floor(
      Math.random() * 1000
    );

  return new Promise(
    (resolve, reject) => {

      sendLog(
        jobId,
        `🚀 Deploying container on port ${port}`
      );

      const process =
      spawn(
        "docker",
        [
          "run",
          "-d",
          "--name",
          containerName,
          "-p",
          `${port}:3000`,
          imageName
        ]
      );

      let output = "";

      process.stdout.on(
        "data",
        (data) => {

          output +=
          data.toString();

        }
      );

      process.stderr.on(
        "data",
        (data) => {

          sendLog(
            jobId,
            data.toString()
          );

        }
      );

      process.on(
        "close",
        (code) => {

          if (code === 0) {

            sendLog(
              jobId,
              `✅ Container running`
            );

            resolve({
              port,
              containerName
            });

          } else {

            reject(
              new Error(
                "Deployment failed"
              )
            );

          }

        }
      );

    }
  );

}

module.exports = {
  deployContainer
};