import React, {useContext, useEffect, useState} from "react";
import "./Header.css"
import { Link, useNavigate } from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {fetchProjectsForUser, fetchUserById} from "../services/service";

const Header = () => {
    const [avatar, setAvatar] = useState(null)


    let navigate = useNavigate();
    const auth = useContext(AuthContext);

    useEffect (() => {
        const getUser = async () => {
            const _user = await fetchUserById(auth.getUserId())
        }

        getUser()
        },
        [auth, navigate]
    )

    return(
        <div className="future-header">
            <div className="header-content">
                <div className="header-left-block">
                    <p className="company-name" style={{pointerEvents: "none"}}>CoReTool</p>
                </div>
                <div className="header-right-block">
                    <div className="company-name" onClick={() => navigate.push("/feed")}> Feed </div>
                    <p className={"company-name"} style={{pointerEvents: "none"}}>|</p>
                    <div className="company-name" onClick={() => navigate.push("/profile")}> Profile</div>
                </div>
            </div>
        </div>
    )
}
export default Header