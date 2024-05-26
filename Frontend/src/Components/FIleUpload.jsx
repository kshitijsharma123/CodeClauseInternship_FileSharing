import axios from "axios";
import React, { useState } from "react";
import { MdFileUpload } from "react-icons/md";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [uuid, setUuid] = useState("");
  const [text, setText] = useState("Copy Link");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const uploadFile = async (file, password) => {
    const formData = new FormData();
    formData.append("file", file);
    if (password) {
      formData.append("password", password);
    }

    try {
      const response = await axios.post(
        "http://localhost:3534/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        const { file, uuid } = response.data;
        let ulr = `/download-page/${uuid}`;
        setDownloadLink(ulr);

        setUuid(uuid);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFile) {
      console.log("Uploading file:", selectedFile);
      uploadFile(selectedFile, password);
      setSelectedFile(null);
      setPassword("");
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/download-page/${uuid}`;
    navigator.clipboard.writeText(link).then(() => {
      setText("Copied to Clipboard");
    });
  };

  return (
    <div className="upload-container bg-white border border-gray-300 rounded-md p-6 shadow-sm w-56 mx-auto">
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center space-y-4 cursor-pointer"
        >
          <MdFileUpload className="h-20 w-20 text-gray-500" />
          <span className="text-gray-500">Click to select</span>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {selectedFile && (
          <p className="mt-4 text-gray-600 text-center">
            Selected file: {selectedFile.name}
          </p>
        )}
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter password"
          className="mt-4 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!selectedFile}
          className="mt-6 w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-500 font-medium rounded-md text-sm px-5 py-2.5 shadow-sm disabled:opacity-50"
        >
          Upload
        </button>
      </form>
      {downloadLink && (
        <div className="mt-6">
          <p className="text-gray-600 text-center">
            File uploaded successfully!
          </p>
          <p className="text-gray-600 text-center mt-2">
            <a
              href={downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600"
            >
              Download Link
            </a>
          </p>
          <button
            onClick={handleCopyLink}
            className="mt-4 w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-500 font-medium rounded-md text-sm px-5 py-2.5 shadow-sm"
          >
            {text}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
