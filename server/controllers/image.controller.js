const jobStore = require("../store/jobStore");

exports.updateImage = (req,res)=>{

    const {
        jobId,
        imageName
    } = req.body;

    jobStore.update(
        jobId,
        {
            imageName
        }
    );

    res.json({
        success:true
    });

}