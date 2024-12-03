import React, { useState } from "react";
import "../styles/Navbar.css";
import profilePhoto from "../assets/ProfilePhoto.webp";
import hamburgerImg from "../assets/HamburgerImg.png";
import bookmarksImg from "../assets/bookmarksImg.png";
import { useNavigate } from 'react-router-dom'
import { USER_API_END_POINT } from "../utils/constant";
import { toast } from "react-toastify";
import axios from "axios";
import { useUser } from "../UserContext";

const Navbar = ({ setShowRegister, setShowLogin, setAddStory }) => {
  const { user, setUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });

      if (res.data.success) {
        setUser(null);
        localStorage.removeItem('user');
        navigate("/");
        toast.success(res.data.message);
        console.log("Logout Successfull.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className="navbar">
      {
        !user ? (
          <>
            <button className="registerBtn" onClick={() => setShowRegister(true)}>Register Now</button>
            <button className="signInBtn" onClick={() => setShowLogin(true)}>Sign In</button>
          </>
        ) : (
          <>
            <button className="registerBtn bookmarksBtn" onClick={() => navigate("/bookmarks")}><img src={bookmarksImg} alt="bookmarks" /><p>Bookmarks</p></button>
            <button className="registerBtn" onClick={() => setAddStory(true)}>Add story</button>
            <div className="profilePhotoCon"><img src={profilePhoto} alt="profile photo" /></div>
            <a className="icon" onClick={toggleMenu}><button className="hamburgerBtn"><img src={hamburgerImg} alt="hamburger" /></button></a>
            <div id="hamburgerContent" style={{ display: isOpen ? 'flex' : 'none' }}>
              <p>{user?.username}</p>
              <button onClick={logoutHandler} className="registerBtn">Logout</button>
            </div>
          </>
        )
      }
    </div>
  );
};

export default Navbar;