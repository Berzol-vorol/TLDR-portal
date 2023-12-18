import React, {useContext, useState, useEffect} from "react";
import "./Header.css"
import {Link, useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext";

const Header = () => {
    const {user, logout} = useContext(UserContext);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    let navigate = useNavigate();
    const logoutHandle = () => {
        logout();
        navigate("/");
    }

    useEffect(() => {
            if (user) setIsLoggedIn(true);
            else setIsLoggedIn(false);
        }, [user]
    );
    return (
        <div className={""}>
            <div className="future-header">
                <div className="header-content">
                    <div className="header-left-block">
                        <Link className="header-link" to={("/")}>TLDR</Link>
                    </div>
                    <div className="header-right-block">
                        {isLoggedIn ?
                            <div className={"header-profile-actions"}><Link className="header-link" to={"/profile"}>Hi, {user.login}!</Link>
                                <div className={"underline logout-action"} onClick={logoutHandle}>(Logout)</div>
                            </div> :
                            <Link className="header-link underline" to={"/sign_in"}>Log in</Link>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Header