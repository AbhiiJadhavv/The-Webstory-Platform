import React, { useState } from "react";
import "../styles/NavbarMobile.css";
import profilePhoto from "../assets/ProfilePhoto.webp";
import hamburgerImg from "../assets/HamburgerImg.png";
import bookmarksImg from "../assets/bookmarksImg.png";
import { useNavigate } from 'react-router-dom'
import { USER_API_END_POINT } from "../utils/constant";
import { toast } from "react-toastify";
import axios from "axios";
import { useUser } from "../UserContext";

const NavbarMobile = ({ setShowRegister, setShowLogin, setAddStory }) => {
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
        <div className="navbarMobile">
            <a className="icon" onClick={toggleMenu}><button className="hamburgerBtn"><img src={hamburgerImg} alt="hamburger" /></button></a>
            <div id="hamburgerContentMobile" style={{ display: isOpen ? 'flex' : 'none' }}>
                {
                    !user ? (
                        <>
                            <button className="registerBtn" onClick={() => setShowRegister(true)}>Register Now</button>
                            <button className="signInBtnMobile" onClick={() => setShowLogin(true)}>Sign In</button>
                        </>
                    ) : (
                        <>
                            <div className="profileConMobile">
                                <div className="profilePhotoCon"><img src={profilePhoto} alt="profile photo" /></div>
                                <p>{user?.username}</p>
                            </div>
                            <button className="registerBtn" onClick={() => setAddStory(true)}>Add story</button>
                            <button className="registerBtn bookmarksBtn" onClick={() => navigate("/bookmarks")}><img src={bookmarksImg} alt="bookmarks" /><p>Bookmarks</p></button>
                            <button onClick={logoutHandler} className="registerBtn logoutMobile">Logout</button>
                        </>
                    )
                }

                
            </div>

        </div>
    );
};

export default NavbarMobile;