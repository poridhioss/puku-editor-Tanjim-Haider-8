const axios = require("axios");

const SERVER_URL =
process.env.SERVER_URL ||
"http://server:8000";

async function sendDeployment(
  deployment
) {

  await axios.post(
    `${SERVER_URL}/api/deployment`,
    deployment
  );

}

module.exports = {
  sendDeployment
};