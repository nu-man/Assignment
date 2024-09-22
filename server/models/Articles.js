import mongoose from 'mongoose'; 


const articleSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    articleText: { type: String },
    publishDate: { type: Date, default: Date.now },
    image: { type: String, default: null },
    likes: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Define a virtual for the full image URL
articleSchema.virtual('imageUrl').get(function() {
  return this.image ? `http://localhost:5000/uploads/${this.image}` : null;
});

const Article = mongoose.model("Article", articleSchema);
export default Article;
