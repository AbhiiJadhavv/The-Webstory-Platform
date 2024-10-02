import React, { useState } from 'react'
import "../styles/Login.css";
import closeIcon from "../assets/closeIcon.png";
import eyeIcon from "../assets/eyeIcon.png";
import { USER_API_END_POINT } from '../utils/constant';
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = ({ setShowRegister }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [input, setInput] = useState({
        username: "",
        password: ""
    })

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const registerHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${USER_API_END_POINT}/register`, input, {
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials:true,
            });
            if(res.data.success){
                setShowRegister(false);
                console.log("Registration Successful.");
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
                    <button onClick={() => setShowRegister(false)}><img src={closeIcon} alt="close button" /></button>
                </div>
                <div className='loginParaCon'>
                    <p>Register</p>
                </div>
                <div className='loginFormCon'>
                    <form onSubmit={registerHandler}>
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
                            <button type='submit'>Register</button>
                        </div>
                    </form>
                </div>
                <ToastContainer position="top-right" />
            </div>
        </div>
    )
}

export default Register;