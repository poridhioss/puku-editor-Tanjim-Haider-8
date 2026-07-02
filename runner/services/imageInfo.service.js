const axios = require("axios");

const SERVER_URL = process.env.SERVER_URL || "http://server:8000";

async function sendImage(data){

    await axios.post(

        `${SERVER_URL}/api/image`,

        data

    );

}

module.exports = {

    sendImage

};