import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from 'url';

import connectDB from "./dbconnect.js";
import userRouter from "./users/index.js";
import cors from "cors";

const port = 5000;

app.use(cors());
app.use(express.json()); // Body parser

connectDB();

// Manually define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/user/", userRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
