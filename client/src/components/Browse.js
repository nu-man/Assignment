import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Browse.css";

export default function Browse() {
  const [articles, setArticles] = useState([]);
  let navigate = useNavigate();
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get("/api/user/articles", {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        });
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const handleLike = async (articleId) => {
    try {
      const { data } = await axios.put(
        `/api/user/like/${articleId}`,
        {},
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      // Update the article list with the new like status
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article._id === articleId
            ? { ...article, likes: data.likes }
            : article
        )
      );
    } catch (error) {
      console.error("Error liking/unliking article:", error);
    }
  };

  //logout logic
  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="browse-container">
      <h3 className="browse-heading">All Articles</h3>
      <ul className="article-list">
        {articles.map((article) => (
          <li key={article._id} className="article-card">
            <h4 className="article-title">Title: {article.title}</h4>
            <p className="article-description">
              Description: {article.description}
            </p>
            <p className="article-publishDate">
              Published on: {new Date(article.publishDate).toLocaleDateString()}
            </p>
            {article.image && (
              <img
                src={`http://localhost:5000/uploads/${article.image}`} // Adjust this according to how you store the image path
                alt={article.title}
                className="article-image"
              />
            )}

            <p className="article-user">
              User:{" "}
              {article.createdBy ? article.createdBy.name : "Unknown User"}
            </p>

            {/* Like Button */}
            <div className="like-section">
              <button
                className="like-button"
                onClick={() => handleLike(article._id)}
              >
                Like
              </button>
              <span className="like-count">
                {article.likes?.length || 0} Likes
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="browse-upload">
        <p>
          Want to upload articles?{" "}
          <Link to="/dashboard" className="link">
            Upload
          </Link>{" "}
          ||{" "}
          <span className="link" onClick={logoutHandler}>
            {" "}
            Logout
          </span>
        </p>
      </div>
    </div>
  );
}
