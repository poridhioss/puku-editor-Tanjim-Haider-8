const app = require("./app");
const http = require("http");
const { initSocket } = require("./socket/socket");

const server = http.createServer(app);
initSocket(server);

server.listen(process.env.PORT || 8000 , () => {
  console.log("Server running on port 8000");
});