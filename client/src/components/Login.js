import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Login() {
  const [logindata, setLogindata] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/browse", { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  const onChangeHandler = (e) => {
    setLogindata({
      ...logindata,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/login", logindata);
      localStorage.setItem("token", data.token);
      navigate("/browse", { replace: true });
    } catch (error) {
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
      }
      console.log(error);
    }
  };

  return (
    <div className="form-container">
      <div className="card">
        <form onSubmit={onSubmitHandler}>
          <h3>Login</h3>
          <label className="label">
            Email:
            <input
              type="email"
              name="email"
              className="input-field"
              onChange={onChangeHandler}
            />
          </label>
          <label className="label">
            Password:
            <input
              type="password"
              name="password"
              className="input-field"
              onChange={onChangeHandler}
            />
          </label>
          <input type="submit" value="Login" className="submit-btn" />
        </form>
        <p>
          New here?{" "}
          <Link to="/register" className="link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
