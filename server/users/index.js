import express from "express";
import bcrypt from "bcrypt";
import User from "../models/Users.js";
import Article from '../models/Articles.js'; // import your article model
import { authMiddleware } from "../middleware/auth.js";
import multer from "multer"; // Import multer
import path from "path";    // For handling file paths



import jwt from "jsonwebtoken";

const router = express.Router();
// Multer Configuration: Set up storage and file handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Set upload folder
    },
    filename: (req, file, cb) => {
      // Set unique file name
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  // File filter to allow only specific file types (optional)
  const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  };
  
  // Set up Multer upload
  const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
  });

// Register API

/*
  API: /api/user/register
  Desc: User Signup
  Method: POST
  Access: Public
  Validation: email is unique

*/

router.post("/register", async (req, res) => {
  try {
    // Check if the user with the given email already exists
    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // Create a new user object
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();

    // Send success response
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Unable to register.Internal server error" });
  }
});

/*
login logic
  API: /api/user/login"
  Desc: User login
  Method: POST
  Access: Public
  Params: token

*/

router.post("/login", async (req, res) => {
  try {
    // Check if the email exists
    const found = await User.findOne({ email: req.body.email });
    if (!found) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the entered password with the hashed password
    const match = await bcrypt.compare(req.body.password, found.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create the JWT token payload
    const payload = {
      user_id: found._id,
      email: found.email,
    };

    // Generate the JWT token with a secret key
    const token = jwt.sign(payload, "bixmonk", {
      expiresIn: "1h", // Token expiration time
    });

    // Send the token as part of the response
    return res.status(200).json({ success: "Valid token", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error. Try again." });
  }
});

/*
  API: /api/user/auth"
  Desc: jwt token auth
  Method: POST
  Access: Public
  Params: token
  Validation: valid token

*/

router.get("/auth", async (req, res) => {
  try {
    let decoded = jwt.verify(req.headers["auth-token"], "bixmonk");
    res.status(200).json({ user_id: decoded.user_id });
    //console.log(decoded);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unauthorized or token expired." });
  }
});

/**
 * POST: /api/user/articles
 * Description: Adds a new article with optional media upload
 * Access: Protected
 */

router.post("/add", authMiddleware, upload.single("media"), async (req, res) => {
    try {
      const { title, description, publishDate } = req.body;
      
      // The uploaded file is in req.file
      const media = req.file ? `/uploads/${req.file.filename}` : null;
  
      // Create a new article with the userId from req.user (extracted via middleware)
      const newArticle = new Article({
        title,
        description,
        publishDate,
        image: media, // Store the media file path
        createdBy: req.user._id, // Pass the authenticated user ID
      });
  
      // Save to the database
      await newArticle.save();
      res.status(201).json(newArticle);
    //   console.log("Uploaded file:", req.file);

    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

/**
 * GET: /api/user/articles
 * Description: Sends data to frontend
 * Access: Protected
 */
router.get("/articles", authMiddleware, async (req, res) => {
    try {
      // Fetch articles from the database
      const articles = await Article.find().populate('createdBy', 'name'); // Assuming 'name' is a field in your User model
      res.status(200).json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Server error" });
    }
  });


/**
 * PUT: /api/user/like
 * Description: lioking/unlining
 * Access: Protected
 */

  router.put('/like/:id', authMiddleware, async (req, res) => {
    try {
      const articleId = req.params.id;
      const userId = req.user._id; // This should be defined
  
      const article = await Article.findById(articleId);
      console.log("Article found:", article); // Log the article after fetching it
  
      if (!article) return res.status(404).json({ message: "Article not found" });
  
      // Ensure likes is an array
      if (!Array.isArray(article.likes)) {
        article.likes = [];
      }
  
      if (article.likes.includes(userId)) {
        article.likes = article.likes.filter(id => id.toString() !== userId.toString());
      } else {
        article.likes.push(userId);
      }
  
      await article.save();
      res.status(200).json({ message: "Success", likes: article.likes });
    } catch (error) {
      console.error("Error liking/unliking article:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  


export default router;
