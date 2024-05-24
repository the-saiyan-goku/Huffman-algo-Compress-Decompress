// Uploader.js
import React, { Component } from "react";
import "./uploader.css";
import { post, get } from "axios";
import download from "js-file-download";
import { Animated } from "react-animated-css";

class Uploader extends Component {
  state = {
    file: null,
    fileUploaded: false,
    response: "",
    uploadedFiles: [],
    cppOutput: "",
  };

  componentWillMount() {
    this.handleDelay();
  }

  runCppCode = () => {
    post("/runcpp")
      .then((response) => {
        this.setState({ cppOutput: response.data });
      })
      .catch((error) => {
        console.error("Error running C++ code:", error);
      });
  };

  runCppCode1 = () => {
    post("/runcpp1")
      .then((response) => {
        this.setState({ cppOutput: response.data });
      })
      .catch((error) => {
        console.error("Error running C++ code:", error);
      });
  };

  handleDelay() {
    get("/getFiles")
      .then((res) => {
        this.setState({
          fileUploaded: false,
          response: "",
          uploadedFiles: res.data.uploadedFiles.map((filename) => ({
            filename: filename,
            size: null, // Initialize size as null
          })),
          fileCount: res.data.uploadedFiles.length,
        });
        this.props.fileCount(this);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }
  fetchFileSize = (filename) => {
    get("/getFileSize", { params: { filename: filename } })
      .then((response) => {
        const fileSize = response.data.size; // Change here
        this.setState((prevState) => ({
          uploadedFiles: prevState.uploadedFiles.map((file) =>
            file.filename === filename ? { ...file, size: fileSize } : file
          ),
        }));
      })
      .catch((error) => {
        console.error("Error fetching file size:", error);
      });
  };
  

  onFormSubmit(e) {
    e.preventDefault();
    if (this.state.file !== null) {
      this.fileUpload(this.state.file)
        .then((res) => {
          this.setState({
            fileUploaded: true,
            response: res.data.message,
            file: null,
          });
          // Fetch file size after uploading
          this.fetchFileSize(res.data.filename);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
      this.timer = setTimeout(this.handleDelay.bind(this), 2000);
    } else {
      this.setState({
        fileUploaded: true,
        response: "No files chosen",
      });
      this.timer = setTimeout(this.handleDelay.bind(this), 1000);
    }

    this.refs.inputfile.value = "";
  }

  onChange(e) {
    this.setState({
      file: e.target.files[0],
    });
  }

  fileUpload(file) {
    const formData = new FormData();
    formData.append("file", file);
    return post("/", formData);
  }

  fileDownload(index, filename, evnt) {
    if (evnt.target.className === "download-btn") {
      get("/download", { params: { filename: filename, index: index } })
        .then((res) => {
          download(res.data, filename);
        })
        .catch((error) => {
          console.error("Error downloading file:", error);
        });
    }
  }

  componentDidMount() {
    // Fetch file sizes when component mounts
    this.state.uploadedFiles.forEach((file) => {
      this.fetchFileSize(file.filename);
    });
  }

  render() {
    return (
      <section className="main-section">
        <form onSubmit={this.onFormSubmit.bind(this)}>
          <section className="title">
            <h1 className="main-title">
              {this.state.fileUploaded
                ? this.state.response
                : "Content uploader"}
            </h1>
            <p className="sub-title">Simple content uploader</p>
          </section>
          <section className="btns">
            <input
              multiple
              type="file"
              name="file"
              ref="inputfile"
              id="file"
              className="inputfile"
              onChange={this.onChange.bind(this)}
            />
            <button type="submit" className="btn-left">
              Upload
            </button>
            <br />
          </section>
        </form>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className="btn-left" onClick={this.runCppCode}>Compress Text File</button>
          
        <button className="btn-left" onClick={this.runCppCode1}>Decompress Text File</button>
        </div>
        <section className="uploadContainer">
          {this.props.startFetch ? (
            <ul>
              <Animated
                animationIn="jello"
                animationOut="wobble"
                isVisible={true}
              >
                {this.state.uploadedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="file-name"
                    onClick={this.fileDownload.bind(this, index, file.filename)}
                  >
                    <p>{file.filename}</p>
                    <p>Size: {file.size !== null ? file.size + " bytes" : "..."}</p>
                    <button className="download-btn">DOWNLOAD</button>
                  </li>
                ))}
              </Animated>
            </ul>
          ) : (
            ""
          )}
        </section>
      </section>
    );
  }
}

export default Uploader;
