import React, { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { UserContext } from '../context/UserContext';
import "./Sign_in.css"
import "./Push_summary.css"
import { useNavigate, Link} from 'react-router-dom';
import { signUpUser } from '../services/service';


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
            Cookies.set('token',token, {expires: 1});
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
                        Email
                    </p>
                    <input className={"input-data"} value={inputEmail}
                            onChange={(event) => {setInputEmail(event.target.value)}} type="text" />
                    <p className="text">
                        Password
                    </p>
                    <input className={"input-data"} value={inputPassword}
                            onChange={(event) => {setInputPassword(event.target.value)}} type="text" />
                    
                    <p className="validation">{validation}</p>

                    <div className="submit">
                        <Link  to="/"><div className="button">Back</div></Link>
                        <div className="button" variant="success" onClick={() =>
                                    handleSignUp()}>Sign Up</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Sign_up;

