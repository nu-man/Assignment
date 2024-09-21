import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import '../App.css'; 
import axios from "axios"
axios.defaults.baseURL = 'http://localhost:5000'; // Add this line at the top of your Register component


export default function Register() {
  const navigate=useNavigate()
  const [registerData, setRegisterData] = useState({
    email: "",
    name: "",
    mobile: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(registerData); 
    try {
      const { data } = await axios.post("/api/user/register", registerData);
     
       alert("User registered succesfull. Redirecting to login");
  
      setTimeout(() => {
        navigate("/login",{replace:true});
      }, 3000);




    } catch (error) {
      console.log(error.response?.data?.error);
    }
  };
  

  return (
    <div className="form-container">
      <div className="card">
        <form onSubmit={onSubmitHandler}>
          <h3>Register</h3>
          <label className="label">
            Email:
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={onChangeHandler}
              className="input-field"
            />
          </label>
          <label className="label">
            Name:
            <input
              type="text"
              name="name"
              value={registerData.name}
              onChange={onChangeHandler}
              className="input-field"
            />
          </label>
          <label className="label">
            Mobile:
            <input
              type="text"
              name="mobile"
              value={registerData.mobile}
              onChange={onChangeHandler}
              className="input-field"
            />
          </label>
          <label className="label">
            Password:
            <input
              type="password"
              name="password"
              value={registerData.password}
              onChange={onChangeHandler}
              className="input-field"
            />
          </label>
          <input type="submit" value="Register" className="submit-btn" />
        </form>
        <p>
          Already registered?{" "}
          <Link to="/login" className="link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
