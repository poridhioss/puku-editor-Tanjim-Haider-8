const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { sendLog } = require("./log.service");

function runCommand(cmd, args, repoPath, jobId) {
  return new Promise((resolve, reject) => {
    const process = spawn(cmd, args, {
      cwd: repoPath
    });

    process.stdout.on("data", (data) => {
      sendLog(jobId, data.toString());
    });

    process.stderr.on("data", (data) => {
      sendLog(jobId, data.toString());
    });

    process.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} failed with code ${code}`));
    });
  });
}

async function runBuild(job, repoPath) {
  const jobId = job.jobId;

  sendLog(jobId, "🔍 Checking project type...");

  const packageJsonPath = path.join(repoPath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    sendLog(jobId, "❌ Not a Node.js project");
    throw new Error("Unsupported project type");
  }

  try {
    // STEP 1: install dependencies
    sendLog(jobId, "📦 Installing dependencies...");
    await runCommand("npm", ["install"], repoPath, jobId);

    // STEP 2: build (optional but CI-like)
    if (fs.existsSync(path.join(repoPath, "package.json"))) {
      const pkg = require(path.join(repoPath, "package.json"));

      if (pkg.scripts && pkg.scripts.build) {
        sendLog(jobId, "🏗️ Running build...");
        await runCommand("npm", ["run", "build"], repoPath, jobId);
      } else {
        sendLog(jobId, "⚠️ No build script found, skipping build");
      }
    }

    sendLog(jobId, "✅ Build completed successfully");

  } catch (err) {
    sendLog(jobId, `❌ Build failed: ${err.message}`);
    throw err;
  } 
  // finally {
  //   // optional cleanup
  //   sendLog(jobId, "🧹 Cleaning workspace...");
  //   fs.rmSync(repoPath, { recursive: true, force: true });
  // }
}

module.exports = {
  runBuild
};