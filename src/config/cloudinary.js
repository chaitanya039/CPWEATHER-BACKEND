require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "doj90b0q7",
    api_key: "761289635647999",
    api_secret: "FG50rgt60LpRPjJEN58KdPPXZMQ",
    secure : true
});

module.exports = { cloudinary };