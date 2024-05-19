import express from "express";
import { connectDB } from "./config/db.js";
const PORT = 3534;

const app = express();

// Import Router
import fileRoute from "./router/file.router.js";
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/files", fileRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log({ serverLive: true, PORT });
  });
});

export { app };
