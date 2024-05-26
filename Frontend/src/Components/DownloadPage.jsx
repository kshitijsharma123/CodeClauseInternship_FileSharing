import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useParams } from "react-router-dom";
import axios from "axios";

function DownloadPage() {
  const baseURL = "http://localhost:3534/api/files/";
  const { uuid } = useParams();
  const [isPassword, setIsPassword] = useState(false);
  const [url, setUrl] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const downloadlink = async (pwd) => {
    try {

      let response;
      if (!pwd) {
        response = await axios.get(`${baseURL}${uuid}`);
      } else {
        response = await axios.post(`${baseURL}${uuid}`, {
          password: pwd,
        });
      }

      if (response.status === 200 && response.statusText === "OK") {
        const { downloadURL } = response.data;
        setUrl(downloadURL);
        setIsPassword(false);
        setError(null);
      }
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.statusText === "Unauthorized"
      ) {
        setIsPassword(true);
        setError("This file requires a password.");
      } 
      else {
        setError(error.response.data.error)
      }
    }
  };

  const handleClick = () => {
    if (url) {
      window.location.href = url;
    } else {
      setError("No URL available for download.");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    downloadlink(password);
  };

  useEffect(() => {
    downloadlink();
  }, []);

  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col justify-center items-center">
        <div className="h-52 w-52 bg-white rounded-md flex flex-col justify-center items-center p-4">
          {error && <p className="text-red-500 mb-2 font-semibold">{error}</p>}
          {isPassword ? (
            <form
              onSubmit={handlePasswordSubmit}
              className="flex flex-col items-center"
            >
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="mb-2 p-1 border rounded"
              />
              <button
                type="submit"
                className="h-10 bg-green-500 w-24 rounded-md hover:bg-green-600 font-semibold"
              >
                Submit
              </button>
            </form>
          ) : (
            <button
              className="h-10 bg-green-500 w-24 rounded-md hover:bg-green-600 font-semibold"
              onClick={handleClick}
              disabled={!url}
            >
              Download 
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default DownloadPage;
