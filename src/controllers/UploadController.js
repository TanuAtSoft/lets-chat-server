// const S3 = require("aws-sdk/clients/s3");
let AWS = require("aws-sdk");
const moment = require("moment");
const { sendResponse } = require("../helpers/requestHandlerHelper");
const {
  S3_ACCESS_KEY,
  S3_BUCKET_REGION,
  S3_BUCKET,
  S3_SECRET_ACCESS_KEY,
} = require("../utils/s3.constants");

const configs = {
  // bucketName: S3_BUCKET,
  accessKey: S3_ACCESS_KEY,
  secretKey: S3_SECRET_ACCESS_KEY,
  region: S3_BUCKET_REGION,
};

const S3 = new AWS.S3(configs);
const UploadtoS3 = (file) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: S3_BUCKET,
      Key: `public/images/${moment().unix()}-${file.originalname}`,
      Body: file.buffer,
      ACL: "public-read",
    };
    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      //console.log("data", data);
      resolve(data.Location);
    });
  });
};

exports.singleUploader = async (req, res, next) => {
    try {
      if (req.file) {
        await UploadtoS3(req.file).then((result) => {
          return sendResponse(res, true, 200, "presinged url", {
            url: result,
          });
        });
      }
    } catch (error) {
      console.log("error", error);
      next(error);
    }
  }

  exports.multiUploader = async (req, res) => {
    let finalUrls = [];
    //console.log("req.files", req.files)
  
    if (req.files && req.files.length > 0) {
      for (var i = 0; i < req.files.length; i++) {
        // console.log(req.files[i]);
        await UploadtoS3(req.files[i]).then((result) => {
          finalUrls.push(result);
        });
      }
      sendResponse(res, true, 200, "presinged url", {
        urls: finalUrls,
      });
    }
  }