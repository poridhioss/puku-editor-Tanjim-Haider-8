const jobStore = require("../store/jobStore");
const { emitStatus } = require("../socket/socket");

exports.updateStatus = (req,res)=>{

    const {
        jobId,
        status
    } = req.body;

    jobStore.update(
        jobId,
        {
            status
        }
    );

    emitStatus(
        jobId,
        status
    );

    res.json({
        success:true
    });

}