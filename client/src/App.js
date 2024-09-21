import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './components/Login.js';
import Register from './components/Register.js';
import Dashboard from './components/Dashboard.js';
import PrivateRoutes from "./utils/PrivateRoutes.js";
import Browse from './components/Browse.js';

function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    async function verifyToken() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await axios.get("/api/user/auth", {
            headers: { "auth-token": token },
          });
          setAuth(true); // User is authenticated
        } else {
          setAuth(false); // No token, not authenticated
        }
      } catch (error) {
        console.log(error);
        setAuth(false); // Token is invalid
      }
    }
    verifyToken();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          
          {/* Protecting Dashboard Route */}
          <Route element={<PrivateRoutes auth={auth} />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/browse' element={<Browse />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
