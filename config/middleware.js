const jwt = require('jsonwebtoken');
const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const passport = require('passport');

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/avatars/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);

// ------------------------------
let storage_brand = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/brands/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let uploadFile_brand = multer({
  storage: storage_brand,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware_brand = util.promisify(uploadFile_brand);

// ------------------------------------
let storage_photo = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(req);
    cb(null, __basedir + "/photos/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let uploadFile_photo = multer({
  storage: storage_photo,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware_photo = util.promisify(uploadFile_photo);

module.exports = {
    uploadFileMiddleware,
    uploadFileMiddleware_brand,
    uploadFileMiddleware_photo
}