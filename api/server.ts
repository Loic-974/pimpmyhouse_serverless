const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const app = express();
const mkdirp = require("mkdirp");
const fs = require("fs");
const pathFs = require("path");
// render from build dir
//const path = __dirname + "/app/views/";
//app.use(express.static(path));

// ------------------------- Storage Image Fake Server -------------------------------- //
const imageUploadPath = __dirname + "/userImgStorage";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = imageUploadPath + "/" + req.body.userId;
    mkdirp.sync(dest);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const dest = imageUploadPath + "/" + req.body.userId;
    if (fs.existsSync(pathFs.join(dest, file.originalname))) {
      req.fileValidationError = "Image déjà existante";
      return callback(new Error("Image déjà existante"), false);
    } else {
      callback(null, true);
    }
  },
});

// ------------------------- CORS OPTIONS -------------------------------- //

// var corsOptions = {
//   origin: "http://localhost:8081",
// };

var allowedOrigins = ["http://localhost:3000", "http://localhost:8080"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// parse requests of content-type - application/json
app.use(bodyParser.json());

// // parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/sendImage", upload.any(), (req, res) => {
  if (req.fileValidationError) {
    // return res.sendFile();
    return res.end();
    // or even res.render(); whatever response you want here.
  }
  res.status(200);
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
