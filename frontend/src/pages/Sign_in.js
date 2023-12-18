import React, { useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import "./Sign_in.css"
import "./Push_summary.css"
import { Link, useNavigate } from 'react-router-dom';
import {UserContext} from "../context/UserContext";
import { loginUser } from "../services/service";
import Header from "./Header";
import Loading from "./Loading";

const Sign_in = () => {
    const [inputLogin, setInputLogin] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [validation, setValidation] = useState("");
    const [loading, setLoading] = useState(false);

    const { setUser, setToken } = useContext(UserContext);
    let navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        let user_ =  {
            login : inputLogin,
            password : inputPassword
        }

        let { user, token} = await loginUser(user_);


        if(user != null) {
            setToken(token);
            Cookies.set('token', token, {expires: 1});
            setUser(user);
            navigate("/profile");
        } else {
            setInputLogin("");
            setInputPassword("");
            setValidation("Invalid credentials");
        }
        setLoading(false);
    }


    return (
        <div style={{height: "100%", width: "100%"}}>
            { Header() }
            <div className={loading ? "main-div-wrapper" : "display-none"}>
                <Loading/>
            </div>
            <div className="container">
                <div className="inside-container">
                    <div className="inside-container-content">
                        <div className="log-form">
                            <div className="log-header">
                                Log in to your account
                            </div>
                            {
                                validation ? <div className={"validation"}> { validation } </div> : <></>
                            }
                            <div className={"log-input"}>
                                <label className={"log-input-label"}>Username</label>
                                <input title="username" className={"log-input-data"} value={inputLogin}
                                       onChange={(event) => {setInputLogin(event.target.value)}} type="text" />
                            </div>
                            <div className={"log-input"}>
                                <label className={"log-input-label"}>Password</label>
                                <input className={"log-input-data"} value={inputPassword}
                                       onChange={(event) => {setInputPassword(event.target.value)}} type="password" />
                            </div>
                            <div className="log-input">
                                <div className="log-button" variant="success"
                                     onClick={() => handleLogin()} >Log In</div>
                            </div>
                            <div className="log-sign-up">If you don't have an account go to  <Link className={"log-sign-up-link"} to="/sign_up">sign up</Link>.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sign_in;
