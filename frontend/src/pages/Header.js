import React, {useContext} from "react";
import "./Header.css"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Header = () => {
    const { user } = useContext(UserContext);

    let navigate = useNavigate();


    return(
        <div className="future-header">
            <div className="header-content">
                <div className="header-left-block">
                    <div className="company-name" onClick={() => navigate("/feed")}>TLDR</div>
                </div>
                <div className="header-right-block">
                    <div className="company-name" onClick={() => navigate("/profile")}>Hi, {user.login}!</div>
                </div>
            </div>
        </div>
    )
}
export default Header