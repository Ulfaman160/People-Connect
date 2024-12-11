import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../login/Login';
import AboutUs from '../aboutus/AboutUs';

const Home = () => {
  const [isNewLogin,setNewLogin]=useState(false);
  const handleLoginSignup = () => {
    setNewLogin(!isNewLogin);
};

  return (
    <div style={{width:"100%"}}>
      {/* Responsive Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          {/* Logo or App Title */}
          <img src="./logo.png" style={{height:"100px", borderRadius:"50%"}} alt="" />
          {/* <h1 style={styles.logo}>About Us</h1> */}

          {/* Login/Signup Button */}
          <button style={styles.button} onClick={handleLoginSignup}>
            Login/Signup
          </button>
        </div>
      </nav>
      {isNewLogin?<Login></Login>:<AboutUs></AboutUs>}
      
    </div>
  );
};

// Inline Styles
const styles = {
  navbar: {
    // width: '1157px',
    // backgroundColor: '#0d6efd', // Navbar background color
    // padding: '10px 20px',
    // boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'center',
    flexFlow:'row wrap',
  },
  navContent: {
    width: '100%',
    maxWidth: '1200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    color: '#fff',
    fontSize: '24px',
    margin: 0,
    fontFamily: 'Arial, sans-serif',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#ffffff',
    color: '#0d6efd',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    transition: 'all 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    color: '#ffffff',
  },
};

export default Home;
