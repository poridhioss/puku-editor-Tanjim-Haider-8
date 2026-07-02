const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { sendLog } = require("./log.service");

async function cloneRepo(job) {
  const repoPath = path.join(
    __dirname,
    "..",
    "workspace",
    job.jobId
  );

  // cleanup old workspace
  if (fs.existsSync(repoPath)) {
    fs.rmSync(repoPath, { recursive: true, force: true });
  }

  await fs.promises.mkdir(repoPath, { recursive: true });

  return new Promise((resolve, reject) => {
    sendLog(job.jobId, "📦 Cloning repository...");

    const git = spawn("git", [
      "clone",
      job.repoUrl,
      repoPath
    ]);

    git.stdout.on("data", (data) => {
      sendLog(job.jobId, data.toString());
    });

    git.stderr.on("data", (data) => {
      sendLog(job.jobId, data.toString());
    });

    git.on("close", (code) => {
      if (code === 0) {
        sendLog(job.jobId, "✅ Git clone completed");
        resolve(repoPath);
      } else {
        reject(new Error("Git clone failed"));
      }
    });
  });
}

module.exports = {
  cloneRepo
};