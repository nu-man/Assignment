import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import connectDB from "./dbconnect.js";
import userRouter from "./users/index.js";
import cors from "cors";

const app = express();
const port = 5000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Manually define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Use user router for API routes
app.use("/api/user/", userRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
