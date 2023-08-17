let AWS = require("aws-sdk"),
  multer = require("multer"),
  multerS3 = require("multer-s3"),
  path = require("path");
const moment = require("moment");
const {
  S3_ACCESS_KEY,
  S3_BUCKET_REGION,
  S3_BUCKET,
  S3_SECRET_ACCESS_KEY,
} = require("../utils/s3.constants");
// CONFIGURATION OF S3
AWS.config.update({
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  accessKeyId: S3_ACCESS_KEY,
  region: S3_BUCKET_REGION,
});

// CREATE OBJECT FOR S3
const S3 = new AWS.S3();
const storage = multer.memoryStorage();
// CREATE MULTER FUNCTION FOR UPLOAD
exports.upload = multer({
  storage: storage,
  // CREATE MULTER-S3 FUNCTION FOR STORAGE
  // storage: multerS3({
  //   s3: S3,
  //    acl: "public-read",
  //   // bucket - WE CAN PASS SUB FOLDER NAME ALSO LIKE 'bucket-name/sub-folder1'
  //   bucket: S3_BUCKET,
  //   contentType: multerS3.AUTO_CONTENT_TYPE,
  //   // META DATA FOR PUTTING FIELD NAME

  //   metadata: function (req, file, cb) {
  //     // console.log("from metadata", file)
  //     cb(null, { fieldName: file.fieldname });
  //   }, // SET / MODIFY ORIGINAL FILE NAME
  //   key: function (req, file, cb) {
  //     cb(null, `public/images/${moment().unix()}-${file.originalname}`); //set unique file name if you wise using Date.toISOString()
  //   },
  // }), // SET DEFAULT FILE SIZE UPLOAD LIMIT
  limits: { fileSize: 1024 * 1024 * 50 }, // 50MB
  // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
  fileFilter: function (req, file, done) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return done(null, true);
    } else {
      return done("Error: Allow images only of extensions jpeg|jpg|png !");
    }
  },
});


