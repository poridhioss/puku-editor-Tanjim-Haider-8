const axios = require("axios");

const SERVER_URL = process.env.SERVER_URL || "http://server:8000";

async function sendLog(jobId, message) {

  const log = message.toString().trim();

  if (!log) return;

  console.log(`[${jobId}] ${log}`);

  try {

    await axios.post(
      `${SERVER_URL}/api/logs`,
      {
        jobId,
        message: log
      }
    );

  } catch (err) {

    console.error(
      "Log send failed:",
      err.message
    );

  }

}

module.exports = {
  sendLog
};