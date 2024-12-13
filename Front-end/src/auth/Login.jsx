import React, { useState } from 'react'
import "../styles/Login.css";
import closeIcon from "../assets/closeIcon.png";
import eyeIcon from "../assets/eyeIcon.png";
import { USER_API_END_POINT } from '../utils/constant';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setShowLogin, setUser }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [input, setInput] = useState({
        username: "",
        password: ""
    })

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem("token", res.data.token);
                setShowLogin(false);
                console.log("Login Successful.");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response.data.message);
        }
    }

    return (
        <div className='loginCon'>
            <div className='login'>
                <div className='closeLoginBtnCon'>
                    <button onClick={() => setShowLogin(false)}><img src={closeIcon} alt="close button" /></button>
                </div>
                <div className='loginParaCon'>
                    <p>Login</p>
                </div>
                <div className='loginFormCon'>
                    <form onSubmit={loginHandler}>
                        <div className='usernameCon'>
                            <label>Username</label>
                            <input
                                type='text'
                                value={input.username}
                                name='username'
                                onChange={changeEventHandler}
                                placeholder='Enter username'
                            />
                        </div>
                        <div className='passwordCon'>
                            <label>Password</label>
                            <div>
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    value={input.password}
                                    name='password'
                                    onChange={changeEventHandler}
                                    placeholder='Enter password'
                                />
                                <img
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    src={eyeIcon} alt="Toggle Password Visibility"
                                />
                            </div>
                        </div>
                        <div className='errorMessageCon'>
                            <p>{errorMessage}</p>
                        </div>
                        <div className='loginBtnCon'>
                            <button type='submit'>Login</button>
                        </div>
                    </form>
                </div>
                <ToastContainer position="top-right" />
            </div>
        </div>
    )
}

export default Login;