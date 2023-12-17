import React, {useContext, useState, useEffect} from "react";
import "./Header.css"
import {Link, useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext";

const Header = () => {
    const {user} = useContext(UserContext);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    let navigate = useNavigate();

    useEffect(() => {
            if (user) setIsLoggedIn(true);
            else setIsLoggedIn(false);
        }, [user]
    );
    return (
        <div className="future-header">
            <div className="header-content">
                <div className="header-left-block">
                    <Link className="company-name" to={("/")}>TLDR</Link>
                </div>
                <div className="header-right-block">
                    {isLoggedIn ?
                        <Link  className="company-name" to={"/profile"}>Hi, {user.login}!</Link> :
                        <Link className="company-name" to={"/sign_in"}>Log in</Link>
                    }
                </div>
            </div>
        </div>
    )
}
export default Header