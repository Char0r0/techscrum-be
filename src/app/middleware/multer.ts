const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');


aws.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const s3 = new aws.S3();

const storage = multerS3({
  s3: s3,
  bucket: 'kitmanimage',
  metadata: function (req:any, file:any, cb:any) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req:any, file:any, cb:any) {
    cb(null, Date.now().toString()  + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
module.exports = upload;
