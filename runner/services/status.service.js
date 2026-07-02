const axios = require("axios");

const SERVER_URL = process.env.SERVER_URL || "http://server:8000";

async function sendStatus(
  jobId,
  status
) {

  await axios.post(
    `${SERVER_URL}/api/status`,
    {
      jobId,
      status
    },
    {
        timeout: 5000
    }
  );

}

module.exports = {
  sendStatus
};