const port = process.env.PORT || 3001;
const express = require("express");
const upload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const serveWith = express();
const { exec } = require("child_process");

serveWith.use(upload());
serveWith.listen(port, () => {
  console.log(`Server is now running at http://localhost:${port}/`);
});

serveWith.get("/getFiles", (req, res) => {
  const uploadedFiles = fs.readdirSync("./downloads");
  res.send({
    uploadedFiles: uploadedFiles
  });
});

serveWith.post("/runcpp", (req, res) => {
  const cppFilePath = "/home/mg/Documents/cppproject/"; 
  const cppFileName = "code.cpp";
  const outputFileName = "code";
  const compileCommand = `g++ ${path.join(cppFilePath, cppFileName)} -o ${path.join(cppFilePath, outputFileName)} && cd ${path.join(cppFilePath)} && ./code`;
  exec(compileCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send("Error running C++ code");
      return;
    }else{
    // console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    
    }
  });
});



serveWith.post("/runcpp1", (req, res) => {
  const cppFilePath = "/home/mg/Documents/cppproject/"; 
  const cppFileName = "code1.cpp";
  const outputFileName = "code1";
  const compileCommand = `g++ ${path.join(cppFilePath, cppFileName)} -o ${path.join(cppFilePath, outputFileName)} && cd ${path.join(cppFilePath)} && ./code1`;
  exec(compileCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send("Error running C++ code");
      return;
    }else{
    // console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    
    }
  });
});


serveWith.get("/download", (req, res) => {
  const file = req.query.filename;
  const filePath = path.join(__dirname, `uploads/${req.query.filename}`);
  console.log(filePath);
  res.download(filePath);
});

serveWith.post("/", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.file;
  const fileName = file.name;
  const desiredFolder = "/home/mg/Documents/file-uploader-downloader-master/api/uploads"; 

 
  file.mv(`${desiredFolder}/${fileName}`, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ message: "File uploaded!" });
  });
});

module.exports = serveWith;
