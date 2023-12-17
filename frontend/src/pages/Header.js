import React, {useContext, useState,  useEffect} from "react";
import "./Header.css"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Header = () => {
    const { user } = useContext(UserContext);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    let navigate = useNavigate();

    useEffect(() => {
        if (user) setIsLoggedIn(true);
        else setIsLoggedIn(false);
    }, [user]
    );
    return(
        <div className="future-header">
            <div className="header-content">
                <div className="header-left-block">
                    <div className="company-name" onClick={() => navigate("/")}>TLDR</div>
                </div>
                <div className="header-right-block">
                    { isLoggedIn ? <div className="company-name" onClick={() => navigate("/profile")}>Hi, {user.login}!</div> :
                        <div className="company-name" onClick={() => navigate("/sign_in")}>Log in</div>
                    }
                </div>
            </div>
        </div>
    )
}
export default Header