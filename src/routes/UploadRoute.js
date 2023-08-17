const express = require("express");
const router = express.Router();
const { upload } = require("../utils/imageUpload");
const uploadController = require("../controllers/UploadController")

router.post("/image", uploadController.singleUploader);

router.post("/images", upload.array("images", 6), uploadController.multiUploader);

module.exports = router;