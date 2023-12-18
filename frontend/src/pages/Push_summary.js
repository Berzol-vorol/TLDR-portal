import React, {useContext, useState, useEffect} from 'react';
import "./Header.css"
import "./Push_summary.css"
import Header from "./Header";
import {useNavigate} from 'react-router-dom';
import {addSummary, generateSummary} from "../services/service";
import {UserContext} from "../context/UserContext";
import Loading from "./Loading";

const handleSubmit = async (inputTitle, inputResourceUrl, inputText, inputTags, navigate, user, setTitleValidation, setSummaryValidation, setLoading) => {
    let valid = true;
    if (!inputTitle) {
        setTitleValidation("title is required.");
        valid = false;
    }
    else setTitleValidation("");
    if (inputText.length < 20) {
        setSummaryValidation("summary need to be at least 20 characters long.");
        valid = false;
    }
    else setSummaryValidation("");

    if (!valid) return;

    setLoading(true);

    let new_summary = {
        title: inputTitle,
        resource_url: inputResourceUrl,
        text: inputText,
        tags: inputTags.split(",").slice(0, 5),
        creator: user.id,
    }

    await addSummary(new_summary, user.token);
    setLoading(false);
    navigate("/profile")
}

const handleGenerateAISummary = async (inputResourceUrl, setInputText, user, setUrlValidation, setGLoading) => {
    if (!inputResourceUrl) {
        setUrlValidation("source url is required for AI generated summary.");
        return
    }
    else setUrlValidation("");
    setGLoading(true)
    let body = {
        resource_url: inputResourceUrl
    }
    let result = await generateSummary(body, user.token);
    setInputText(result)
    setGLoading(false);
}

const Push_summary = () => {
    const {user} = useContext(UserContext);
    const [inputTitle, setInputTitle] = useState("");
    const [inputResourceUrl, setInputResourceUrl] = useState("");
    const [inputText, setInputText] = useState("");
    const [inputTags, setInputTags] = useState("");

    const [urlValidation, setUrlValidation] = useState("");
    const [titleValidation, setTitleValidation] = useState("");
    const [summaryValidation, setSummaryValidation] = useState("");

    const [gLoading, setGLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    let navigate = useNavigate();

    return (
        <div className={loading ? "no-scroll" : ""}>
            {Header()}
            <div className={loading ? "main-div-wrapper" : "display-none"}>
                <Loading/>
            </div>
            <div className={"push-summary-container"}>
                <div className={"push-summary"}>
                    <div className={"push-summary-form"}>
                        <h1 className={"push-summary-form-title"}> Write a summary</h1>
                        <div className={"push-summary-form-main-tip"}>
                            <h2 className={"push-summary-form-main-tip-header"}>Writing a good summary</h2>
                            <div className={"push-summary-form-main-tip-text"}>
                                You're prepared to create a compelling summary, and this guide is designed to assist you
                                in the process.
                            </div>
                            <div className={"push-summary-form-main-tip-steps"}>
                                <h5><b>Steps</b></h5>
                                <ul>
                                    <li>Concisely outline the main idea in a one-sentence title.</li>
                                    <li>Add origin of your topic.</li>
                                    <li>Elaborate on the details of your topic.</li>
                                    <li>Incorporate relevant "tags" to enhance visibility within the community.</li>
                                    <li>Carefully review your summary before posting it to the site.</li>
                                </ul>
                            </div>
                        </div>
                        <div className={"push-summary-form-card"}>
                            <div className={"push-summary-form-card-input-wrap"}>
                                <label className={"push-summary-form-card-label"}>Title</label>
                                {
                                    titleValidation ? <div className={"card-validation"}>Validation failed: { titleValidation } </div> : <></>
                                }
                                <label className={"push-summary-form-card-sub-label"}>Write overall name for your
                                                                                      summary</label>
                                <input className={"push-summary-form-card-input"}
                                       value={inputTitle}
                                       onChange={(event) => {
                                           setInputTitle(event.target.value)
                                       }}
                                       type="text"
                                />
                            </div>
                            {/*<div className={"push-summary-form-card-input-button"}>*/}
                            {/*    Next*/}
                            {/*</div>*/}
                        </div>
                        <div className={"push-summary-form-card"}>
                            <div className={"push-summary-form-card-input-wrap"}>
                                <label className={"push-summary-form-card-label"}>Source URL</label>
                                {
                                   urlValidation ? <div className={"card-validation"}>Validation failed: { urlValidation } </div> : <></>
                                }
                                <label className={"push-summary-form-card-sub-label"}></label>
                                <input className={"push-summary-form-card-input"} value={inputResourceUrl}
                                       onChange={(event) => {
                                           setInputResourceUrl(event.target.value)
                                       }}
                                       type="url"
                                />
                                {/*<div className={"push-summary-form-card-input-button"}>*/}
                                {/*    Next*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <div className={"push-summary-form-card"}>
                            <div className={"push-summary-form-card-textarea-wrap"}>
                                <div className={gLoading ? "" : "display-none"}>
                                    <Loading/>
                                </div>
                                <label className={"push-summary-form-card-label"}>Write your summary</label>
                                {
                                    summaryValidation ? <div className={"card-validation"}>Validation failed: { summaryValidation } </div> : <></>
                                }
                                <label className={"push-summary-form-card-sub-label"}>Minimum 20 characters.</label>
                                <div className={"push-summary-form-card-hint"}>
                                    <div className={"push-summary-form-card-sub-generation"}>
                                        You can generate summary using
                                        <a target="_blank"
                                           rel="noopener noreferrer"
                                           href={"https://rapidapi.com/tldrthishq-tldrthishq-default/api/tldrthis/"}>
                                            AI TLDR tool
                                        </a>.
                                    </div>
                                    <div className={"push-summary-form-card-sub-button"}
                                         onClick={() => handleGenerateAISummary(inputResourceUrl, setInputText, user, setUrlValidation, setGLoading)}>
                                        Generate
                                    </div>
                                </div>
                                <textarea className={"push-summary-form-card-textarea"} value={inputText}
                                          onChange={(event) => {
                                              setInputText(event.target.value)
                                          }}/>
                                {/*<div className={"push-summary-form-card-input-button"}>*/}
                                {/*    Next*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <div className={"push-summary-form-card"}>
                            <div className={"push-summary-form-card-input-wrap"}>
                                <label className={"push-summary-form-card-label"}>Tags</label>
                                <label className={"push-summary-form-card-sub-label"}>Add up to 5 tags separated by coma.</label>
                                <input className={"push-summary-form-card-input"} value={inputTags}
                                       onChange={(event) => {
                                           setInputTags(event.target.value)
                                       }}/>
                                <div className={ gLoading ? "push-summary-form-card-input-publish-button disabled" : "push-summary-form-card-input-publish-button"}
                                     onClick={() => handleSubmit(inputTitle, inputResourceUrl, inputText, inputTags, navigate, user, setTitleValidation, setSummaryValidation, setLoading)}>
                                    Publish summary
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Push_summary;