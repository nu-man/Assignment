import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  let navigate = useNavigate();

  const [articleData, setArticleData] = useState({
    title: "",
    description: "",
    publishDate: "",
  });

  const [mediaFile, setMediaFile] = useState(null); // Store the uploaded file separately
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await axios.get("/api/user/auth", {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        });
        console.log("Token:", token);
        console.log(data);
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true }); // Redirect to login if error
      }
    }
    fetchUser();
  }, [navigate]); // Add navigate as a dependency

  const onChangeHandler = (e) => {
    setArticleData({ ...articleData, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    setMediaFile(e.target.files[0]); // Capture the selected file
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // Fetch user ID from the token
      const token = localStorage.getItem("token");
      const { data: userData } = await axios.get("/api/user/auth", {
        headers: { "auth-token": token },
      });

      // Prepare FormData for file and text data
      const formData = new FormData();
      formData.append("title", articleData.title);
      formData.append("description", articleData.description);
      formData.append("publishDate", articleData.publishDate);
      formData.append("createdBy", userData._id); // Add the user ID from token
      if (mediaFile) {
        formData.append("media", mediaFile); // Append the media file if it exists
      }

      // Post the article data with FormData
      const response = await axios.post("/api/user/add", formData, {
        headers: {
          "auth-token": token,
          "Content-Type": "multipart/form-data", // Set the correct content type
        },
      });

      console.log("Article added:", response.data);
    } catch (error) {
      console.error("Error adding article:", error);
    }
  };

  return (
    <div className="form-container">
      <div className="card">
        <h3>Add Article</h3>
        <form onSubmit={onSubmitHandler} encType="multipart/form-data">
          <label className="label">
            Title:
            <input
              type="text"
              name="title"
              value={articleData.title}
              onChange={onChangeHandler}
              className="input-field"
            />
          </label>
          <label className="label">
            Description:
            <input
              type="text"
              name="description"
              value={articleData.description}
              onChange={onChangeHandler}
              className="input-field"
            />
          </label>
          <label className="label">
            Publish Date:
            <input
              type="date"
              name="publishDate"
              value={articleData.publishDate}
              onChange={onChangeHandler}
              className="input-field"
            />
          </label>
          <label className="label">
            Media (Image/Video):
            <input
              type="file"
              name="media"
              onChange={onFileChange} // Handle file input change
              className="input-field"
            />
          </label>
          <button type="submit" className="submit-btn">
            Upload
          </button>
        </form>
        <p>
          Want to check other users' articles?{" "}
          <Link to="/browse" className="link">
            Browse
          </Link>
        </p>
      </div>
    </div>
  );
}
