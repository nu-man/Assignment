import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  articleText: {
    type: String,
  },
  publishDate: {
    type: Date,
    default: Date.now, // Automatically sets to the current date if not provided
  },
  image: {
    type: String, // URL or file path for the uploaded image
    default: null,
  },
  likes: {
    type: Number,
    default: 0, // Initialize with 0 likes
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User who created the article
  },
}, { timestamps: true }); // This automatically adds createdAt and updatedAt timestamps

const Article = mongoose.model('Article', articleSchema);

export default Article;
