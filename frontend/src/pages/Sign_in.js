import React, { useState, useContext, useEffect } from 'react';
import "./Sign_in.css"
import "./Push_summary.css"
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";
import { loginUser } from "../services/service";

const Sign_in = () => {
    const [inputLogin, setInputLogin] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [validation, setValidation] = useState("")
    const [loading, setLoading] = useState(true)

    const { setUser, setToken } = useContext(UserContext);
    let navigate = useNavigate();

    const handleLogin = async () => {
        let user_ =  {
            login : inputLogin,
            password : inputPassword
        }

        let { user, token} = await loginUser(user_);


        if(user != null) {
            setToken(token);
            localStorage.setItem('token',token);
            setUser(user);
            navigate("/profile");
        } else {
            setInputLogin("");
            setInputPassword("");
            setValidation("Incorrect login or password");
        }

    }


    return (
        <div>
            <div className="main1">
                <div className="container1">
                    <div className="inside-container">
                        <p className="text">
                            Login
                        </p>
                        <input className={"input-data"} value={inputLogin}
                                onChange={(event) => {setInputLogin(event.target.value)}} type="text" />
                        <p className="text">
                            Password
                        </p>
                        <input className={"input-data"} value={inputPassword} 
                                onChange={(event) => {setInputPassword(event.target.value)}} type="password" />
                        <p className="validation">{validation}</p>
                        <div className="submit">
                            <div className="button" variant="success"
                                onClick={() => handleLogin()} >Sign In</div>
                            <Link to="/sign_up"><div className="button" variant="success" >Sign Up</div></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sign_in;
