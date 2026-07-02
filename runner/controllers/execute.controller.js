const gitService = require("../services/git.service");
const buildService = require("../services/build.service");
const dockerService = require("../services/docker.service");

const registryService =
require("../services/registry.service");

const imageService =
require("../services/image.service");

const { sendStatus } =
require("../services/status.service");

const { sendImage } =
require("../services/imageInfo.service");

exports.executeJob = async (req, res) => {

  const job = req.body;

  res.json({
    accepted: true,
    jobId: job.jobId
  });

  try {

    console.log(
      "🚀 Job started:",
      job.jobId
    );

    //-------------------------
    // RUNNING
    //-------------------------

    await sendStatus(
      job.jobId,
      "running"
    );

    //-------------------------
    // CLONE
    //-------------------------

    const repoPath =
      await gitService.cloneRepo(job);

    //-------------------------
    // BUILD PROJECT
    //-------------------------

    // await buildService.runBuild(
    //   job,
    //   repoPath
    // );

    //-------------------------
    // BUILD DOCKER IMAGE
    //-------------------------

    const imageName =
      await dockerService.buildImage(
        job,
        repoPath
      );

    //-------------------------
    // LOGIN DOCKER HUB
    //-------------------------

    await registryService.login(
      job.jobId
    );

    //-------------------------
    // PUSH IMAGE
    //-------------------------

    await imageService.pushImage(
      job.jobId,
      imageName
    );

    //-------------------------
    // LOGOUT
    //-------------------------

    await registryService.logout(
      job.jobId
    );

    //-------------------------
    // UPDATE SERVER
    //-------------------------

    await sendImage({

      jobId:
        job.jobId,

      imageName

    });

    //-------------------------
    // SUCCESS
    //-------------------------

    await sendStatus(
      job.jobId,
      "success"
    );

    console.log(
      "✅ Job finished:",
      job.jobId
    );

  }

  catch(err){

    console.error(
      err
    );

    try{

      await sendStatus(
        job.jobId,
        "failed"
      );

    }
    catch(e){

      console.error(e);

    }

  }

};