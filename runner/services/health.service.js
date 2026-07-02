const axios = require("axios");

async function waitForHealthy(
  url,
  retries = 10
) {

  for (
    let i = 0;
    i < retries;
    i++
  ) {

    try {

      const response =
      await axios.get(url, {
        timeout: 3000
      });

      if (
        response.status >= 200 &&
        response.status < 500
      ) {

        return true;

      }

    } catch (err) {

      console.log(
        `Health check attempt ${
          i + 1
        } failed`
      );

    }

    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          3000
        )
    );

  }

  return false;

}

module.exports = {
  waitForHealthy
};