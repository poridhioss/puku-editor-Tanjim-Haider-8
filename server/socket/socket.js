const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-job", (jobId) => {
      socket.join(jobId);
    });
  });
}

function emitLog(jobId, log) {
  if (!io) return;
  io.to(jobId).emit("log", log);
}



function emitStatus(
  jobId,
  status
) {
  if (!io) return;

  io.to(jobId)
    .emit(
      "status",
      status
    );
}

module.exports = {
  initSocket,
  emitLog,
  emitStatus
};