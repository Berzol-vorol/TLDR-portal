import React, {useContext, useEffect, useState} from 'react';
import "./Summary.css"
import "./Header.css"
import Header from "./Header";
import Loading from "./Loading";
import { useNavigate, useLocation } from 'react-router-dom'
import {UserContext} from "../context/UserContext";
import {fetchSummary, fetchReview, fetchUserById, addReview, editReview, editSummaryMark} from "../services/service";
import moment from "moment/moment";
import Icon from "@mdi/react";
import {mdiAccountCircle, mdiOpenInNew, mdiMenuUp, mdiMenuDown} from "@mdi/js";

const voteUpReview = async (review, navigate, location) => {
    let body = {
        id: review.id,
        content:  review.content,
        mark : review.mark + 1
    }

    await editReview(body)
    navigate("/profile", {state : location.state})

    navigate("/summary", {state : location.state})

}

const voteDownReview = async (review, navigate, location) => {
    review.mark--;

    await editReview(review)

    navigate("/profile", {state: location.state})

    navigate("/summary", {state: location.state})
}

const rankSummary = async (summary, mark, navigate, location) => {
    summary.mark = mark;

    await editSummaryMark(summary);

    navigate("/profile", {state: location.state})

    navigate("/summary", {state: location.state})
}


const handleSubmit = async (summary, inputValue, setSummary, setLoading, user, setGLoading, setInputValue) => {
    if(inputValue === "")
        return;
    let new_review = {
        content: inputValue,
        summary: summary.id,
        creator: user.id,
    }

    setGLoading(true)
    await addReview(new_review);
    const _summary = await fetchSummary(summary.id);

    summary.reviews.push(_summary.reviews[_summary.reviews.length-1])

    let review = await fetchReview(summary.reviews[summary.reviews.length-1]);
    summary.review_data.push(review)
    summary.review_data[summary.review_data.length-1].user = new_review.creator
    // for(let i = 0;i < _summary.reviews.length; i++) {
    //     _summary.review_data[j] = await fetchReview(_summary.reviews[i]);
    //     _summary.review_data[j].user = await fetchUserById(_summary.review_data[j].creator);
    // }
    //setSummary(_summary);

    setGLoading(false)
    setInputValue("")
}

const LeftBarGeneration = ({review, navigate, location}) => {
    return(
        <div className={"left-bar"}>
            <div className={"button-vote"} onClick={() => voteUpReview(review, navigate, location)}>
                <Icon path={mdiMenuUp} size={1.3} />
            </div>
            <p className={"mark-text"}>{review.mark}</p>
            <div className={"button-vote"} onClick={() => voteDownReview(review, navigate, location)}>
                <Icon path={mdiMenuDown} size={1.3} />
            </div>
        </div>
    )

}

const SummaryGeneration = ({summary, setSummary, setLoading}) => {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const [inputValue, setInputValue] = useState("");
    const [inputRank, setInputRank] = useState(5);

    const [gLoading, setGLoading] = useState(false);

    let navigate = useNavigate();

    return(
        <div className={"big-summary-card"}>
            <div className={"big-summary-card-main"}>
                <div className={"review-text-div"}>
                    <p>{summary.text} </p>
                    <div className={"big-summary-card-data-tags"}>
                        {
                            summary.tags.map((res) => {
                                return <div className={"summary-card-data-tag"} key={res}>{res}</div>
                            })
                        }
                    </div>
                </div>
                <div className={"big-summary-card-stats-wrap"}>
                    <div className={"big-summary-card-stats"}>
                        <div className={"summary-card-stats-label"}>{summary.reviews.length} reviews</div>
                        <div className={"summary-card-stats-label"}>{summary.marksNumber} marks</div>
                    </div>
                </div>
            </div>
            <div className={"big-summary-card-data"}>
                <div className={"big-summary-card-data-links"}>
                    <a className={"big-summary-card-data-links-source"}
                       href={summary.resource_url}
                       target="_blank"
                       rel="noopener noreferrer">
                        <Icon className={"big-summary-card-data-links-source-icon"} path={mdiOpenInNew} size={0.9}/>
                        Source Link
                    </a>
                    <div className={"big-summary-card-data-links-author"}>
                        <b>Author:</b>
                        <Icon className={"big-summary-card-data-links-source-icon"} path={mdiAccountCircle} size={1}/>
                        { summary?.user?.login }
                    </div>
                </div>
                <div className={"rate-div"}>
                    <div className={"rate-div-content"}>
                        <select className={"rate-select"} value={inputRank}
                                onChange={(event) => {setInputRank(event.target.value)}}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                        <div  className={user ? "review-rate-button" : "review-rate-button disabled"}
                              onClick={() => rankSummary(summary, inputRank, navigate, location)}>Rate</div>
                    </div>
                </div>
            </div>
            {
                summary.review_data.map(review => {
                    console.log(review);
                    return <div className={"comment-main"} key={review.id}>
                        <LeftBarGeneration review={review} navigate={navigate} location={location} />
                        <div className={"comment-main-text"}>
                            <div className={"big-summary-card-main"}>
                                <p>{review.content} </p>
                             </div>

                            <div className={"comment-author"}>
                                <label className={"big-summary-subheader"}>Posted {moment(review.publish_date).fromNow()}</label>
                                <div className={"big-summary-card-data-links-author"}>
                                    <b>Author:</b>
                                    <Icon className={"big-summary-card-data-links-source-icon"} path={mdiAccountCircle} size={1}/>
                                    { review?.user?.login }
                                </div>
                            </div>
                        </div>

                    </div>;}).reverse()
                }
            <div className={"big-push-summary-form-card"}>
                <div className={"big-push-summary-form-card-textarea-wrap"}>
                    <div className={gLoading ? "" : "display-none"}>
                        <Loading/>
                    </div>
                    <label className={"big-push-summary-form-card-label"}>Your Review</label>
                    <label className={"push-summary-form-card-sub-label"}/>
                    <textarea className={"big-push-summary-form-card-textarea"} value={inputValue}
                           onChange={(event) => {
                               setInputValue(event.target.value)
                           }}/>
                    <div className={ user ? "big-push-summary-form-card-input-publish-button" : "big-push-summary-form-card-input-publish-button disabled"}
                         onClick={() => handleSubmit(summary, inputValue, setSummary, setLoading, user, setGLoading, setInputValue)}>
                        Post your review
                    </div>
                </div>
            </div>
        </div>
    )
}

const Summary = () => {
    const location = useLocation();
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [date, setDate] = useState("")

    let navigate = useNavigate();
        useEffect ( () => {
            const getSummaryForUser = async () => {
                const _summary = await fetchSummary(location.state.summaryId)
                console.log(location.state.summaryId)
                _summary.user = await fetchUserById(_summary.creator);
                _summary.review_data = [];
                for(let i = 0;i < _summary.reviews.length; i++) {
                    let review = await fetchReview(_summary.reviews[i]);
                    review.user = await fetchUserById(review.creator);
                    _summary.review_data.push(review);
                }
                setSummary(_summary)
                setDate(moment(_summary.publish_date).fromNow());
                console.log(date);
                setLoading(false)
            }
            getSummaryForUser()
        },
        [navigate]
    )
    return (
    <div className={loading ? "no-scroll" : ""}>
           { Header() }
        <div className={"main-div"}>
            { loading ?
                <div className={"main-div-wrapper"}>
                    <Loading/>
                </div>
                :
                <div>
                    <div className={"big-summary-wrap"}>
                        <div className={"big-summary-header"}>
                            <p className={"main-div-major-text"}>{summary.title}</p>
                            <label className={"big-summary-subheader"}>Posted {date}</label>
                        </div>
                        <div className={"main-div-button"} onClick={() => navigate("/push_summary")}>Add summary</div>
                    </div>
                    <SummaryGeneration  summary = {summary} setSummary = {setSummary} setLoading = {setLoading}/>
                </div>
            }
        </div>
    </div>
  );
}

export default Summary;