exports.health = (req, res) => {

  res.status(200).json({

    status: "healthy",

    service: "ci-server",

    uptime: process.uptime(),

    timestamp: new Date().toISOString()

  });

};