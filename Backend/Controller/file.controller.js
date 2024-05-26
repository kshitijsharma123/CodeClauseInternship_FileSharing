import { File } from "../Model/file.model.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

import sendMail from "./../services/email.services.js";
import generateEmailTemplate from "../services/emailTemplate.js";

const baseULR = "http://localhost:3534/";

export const fileUpload = async (req, res) => {
  if (!req.file) return res.json({ error: "All fields are required" });

  try {
    const fileObj = {
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size,
    };

    if (req.body.password != null && req.body.password !== "") {
      console.log("working password", req.body.password);
      fileObj.password = await bcrypt.hash(req.body.password, 10);
    }

    const file = await File.create(fileObj);

    if (!file)
      return res.status(500).json({ error: "Error while saving the file" });
    return res.status(200).json({
      file: `${baseULR}api/files/${file.uuid}`,
      uuid: file.uuid,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

  r;
};

export const viewFile = async (req, res) => {
  const { uuid } = req.params;
  try {
    if (!uuid) return res.status(200).json({ error: "uuid not present" });

    const file = await File.findOne({ uuid: uuid });

    if (!file) return res.status(404).json({ error: "NO file with this id" });

    if (file.password === undefined) {
      return res.status(200).json({
        // isPassword: false,
        uuid: file.uuid,
        downloadURL: `${baseULR}api/files/download/${uuid}`,
        fileName: file.filename,
      });
    } else if (req.body.password) {
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        file.password
      );
      if (!isPasswordValid) {
        return res.status(402).json({ error: "Incorrect password" });
      }
      return res.status(200).json({
        // isPassword: true,
        uuid: file.uuid,
        downloadURL: `${baseULR}api/files/download/${uuid}`,
        fileName: file.filename,
      });
    } else {
      res.status(401).json({
        error: "password Protected",
        isPassword: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const downloadFile = async (req, res) => {
  const { uuid } = req.params;

  try {
    if (!uuid) return res.status(200).json({ error: "uuid not present" });
    const file = await File.findOne({ uuid: uuid });
    if (!file) return res.status(404).json({ error: "NO file with this id" });
    const { path } = file;
    return res.download(path, (err) => {
      console.log(err);
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendEmailHandler = async (req, res) => {
  const { uuid, to, from } = req?.body;
  if (!uuid || !to || !from)
    return res.status(404).json({ err: "All fields are required" });

  const file = await File.findOne({ uuid });
  if (file.sender) return res.status(404).json({ err: "Email already send" });

  file.sender = from;
  file.receiver = to;

  const resp = await file.save();

  sendMail({
    from,
    to,
    subject: "File download link",
    text: `Hi,This mail container download link`,
    html: generateEmailTemplate({
      emailFrom: from,
      downloadLink: `${baseULR}api/files/download/${uuid}`,
      size: 1000 + "KB",
      expires: "24 Hours",
    }),
  });

  res.status(200).json({
    message: "Email Send",
  });
};
