import React, {useContext, useState, useEffect} from 'react';
import "./Header.css"
import "./Push_project.css"
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import {addProject} from "../services/service";
import {AuthContext} from "../context/AuthContext";

const handleSubmit = async (inputTitle, inputDescription, inputCode, navigate, auth) => {
    let new_project = {
        title: inputTitle,
        description: inputDescription,
        code: inputCode,
        tags : [],
        creator: auth.getUserId(),
    }

    await addProject(new_project);
    navigate.push("/profile")
}

const Push_project = () => {
    const auth = useContext(AuthContext);
    const [inputTitle, setInputTitle] = useState("");
    const [inputDescription, setInputDescription] = useState("");
    const [inputCode, setInputCode] = useState("");

    let navigate = useNavigate();

    useEffect( () => {
        const checkAuth = async () => {
            if(auth.getUserId() == null){
                navigate.push("/")
            }
        }
        checkAuth()
    }, [auth, navigate]
    )

    return (
        <div>
            { Header() }
            <div className={"main"}>
                <div className={"main-content"}>
                    <div className={"main-content-left-column"}>
                        <div>
                            <label className={"input-label"}>Project title</label>
                            <input className={"input-data"} value={inputTitle}
                                   onChange={(event) => {setInputTitle(event.target.value)}} type="text" />
                        </div>
                        <div>
                            <label className={"input-label"}>Description</label>
                            <input className={"input-data"} value={inputDescription}
                                   onChange={(event) => {setInputDescription(event.target.value)}} type="text" />
                        </div>

                        <div className={"project-button"}
                            onClick={() => handleSubmit(inputTitle, inputDescription, inputCode, navigate, auth)}>
                            <p className={"add-project-text"}>Push project</p>
                        </div>
                    </div>
                    <div className={"main-content-right-column"}>
                        <textarea className={"text-area"} value={inputCode} placeholder="Add your code here"
                                  onChange={(event) => {setInputCode(event.target.value)}}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Push_project;