import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import "./Sign_in.css"
import "./Push_summary.css"
import { useNavigate, Link} from 'react-router-dom';
import { signUpUser } from '../services/service';
import Header from "./Header";


const Sign_up = () => {
    const [inputLogin, setInputLogin] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [validation, setValidation] = useState("")

    const { setUser, setToken } = useContext(UserContext);
    let navigate = useNavigate();

    const handleSignUp = async () => {
        let user_ = {
            login: inputLogin,
            email: inputEmail,
            password: inputPassword,
            image: ""
        }

        let { user, token} = await signUpUser(user_);

        if(user != null) {
            setToken(token);
            localStorage.setItem('token',token);
            setUser(user);
            navigate("/profile");
        } else {
            setInputLogin("");
            setInputEmail("");
            setInputPassword("");
            setValidation("There is user with same login")
        }
    }

    return (
        <div style={{height: "100%", width: "100%"}}>
            { Header() }
            <div className="container">
                <div className="inside-container">
                    <div className="inside-container-content">
                        <div className="log-form">
                            <div className="log-header">
                                Create a new account
                            </div>
                            <div className={"log-input"}>
                                <label className={"log-input-label"}>Username</label>
                                <input className={"log-input-data"} value={inputLogin}
                                       onChange={(event) => {setInputLogin(event.target.value)}} type="text" />
                            </div>
                            <div className={"log-input"}>
                                <label className={"log-input-label"}>Email</label>
                                <input className={"log-input-data"} value={inputEmail}
                                       onChange={(event) => {setInputEmail(event.target.value)}} type="text" />
                            </div>
                            <div className={"log-input"}>
                                <label className={"log-input-label"}>Password</label>
                                <input className={"log-input-data"} value={inputPassword}
                                       onChange={(event) => {setInputPassword(event.target.value)}} type="password" />
                            </div>
                            <div className="log-input">
                                <div className="log-button" variant="success"
                                     onClick={() => handleSignUp()} >Sign up</div>
                            </div>
                            <div className="log-sign-up">If you already have an account go to <Link className={"log-sign-up-link"} to="/sign_in">login</Link>.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sign_up;

