import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import axios from 'axios'

//Ensure credentials are being sent with every request
axios.defaults.withCredentials = true;

export default function NavButtons() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/login');
        console.log("loggedInData:", response.data);
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/logout');
      localStorage.clear(); 
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (location.pathname.startsWith("/dashboard")) {
    return (
      <div className='nav-buttons'>
        <button className="navbar-button" id="btnLogout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  if (isLoggedIn && ["/", "/pay", "/map-page", "/legislation"].includes(location.pathname)) {
    return (
      <div className='nav-buttons'>
        <button className="navbar-button" id="btnProfil" onClick={() => { navigate('/dashboard') }}>
          Profile
        </button>
        <button className="navbar-button" id="btnLogout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className='nav-buttons'>
      <button className="navbar-button" id="btnAutentificare" onClick={() => { navigate("/login") }}>
        Log in
      </button>
      <button className="navbar-button" id="btnInregistrare" onClick={() => { navigate("/inregistrare") }}>
        Sign in
      </button>
    </div>
  )
}
