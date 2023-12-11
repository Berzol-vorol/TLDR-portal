import React, {useContext, useState, useEffect} from 'react';
import "./Header.css"
import "./Push_summary.css"
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import {addSummary, generateSummary} from "../services/service";
import {AuthContext} from "../context/AuthContext";

const handleSubmit = async (inputTitle, inputResourceUrl, inputText, navigate, auth) => {
    let new_summary = {
        title: inputTitle,
        resource_url: inputResourceUrl,
        text: inputText,
        tags : [],
        creator: auth.getUserId(),
    }

    await addSummary(new_summary);
    navigate("/profile")
}

const handleGenerateAISummary = async (inputResourceUrl, setInputText) => {
    let body = {
        resource_url: inputResourceUrl
    }
    let result = await generateSummary(body);
    setInputText(result)
}

const Push_summary = () => {
    const auth = useContext(AuthContext);
    const [inputTitle, setInputTitle] = useState("");
    const [inputResourceUrl, setInputResourceUrl] = useState("");
    const [inputText, setInputText] = useState("");

    let navigate = useNavigate();

    useEffect( () => {
        const checkAuth = async () => {
            if(auth.getUserId() == null){
                navigate("/")
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
                            <label className={"input-label"}>Summary title</label>
                            <input className={"input-data"} value={inputTitle}
                                   onChange={(event) => {setInputTitle(event.target.value)}} type="text" />
                        </div>
                        <div>
                            <label className={"input-label"}>Resource Url</label>
                            <input className={"input-data"} value={inputResourceUrl}
                                   onChange={(event) => {setInputResourceUrl(event.target.value)}} type="text" />
                        </div>

                        <div className={"summary-button"}
                            onClick={() => handleGenerateAISummary(inputResourceUrl, setInputText)}>
                            <p className={"add-summary-text"}>Get AI summary</p>
                        </div>

                        <div className={"summary-button"}
                            onClick={() => handleSubmit(inputTitle, inputResourceUrl, inputText, navigate, auth)}>
                            <p className={"add-summary-text"}>Push summary</p>
                        </div>
                    </div>
                    <div className={"main-content-right-column"}>
                        <textarea className={"text-area"} value={inputText} placeholder="Add your text here"
                                  onChange={(event) => {setInputText(event.target.value)}}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Push_summary;