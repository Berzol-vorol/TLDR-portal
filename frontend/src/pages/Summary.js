import React, {useContext, useEffect, useState} from 'react';
import "./Summary.css"
import "./Header.css"
import Header from "./Header";
import Loading from "./Loading";
import { useNavigate, useLocation } from 'react-router-dom'
import {UserContext} from "../context/UserContext";
import {fetchSummary, fetchReview, fetchUserById, addReview, editReview, editSummaryMark} from "../services/service";

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


const handleSubmit = async (summary, inputValue, setSummary, setLoading, user) => {
    if(inputValue === "")
        return;
    let new_review = {
        content: inputValue,
        summary: summary.id,
        creator: user.id,
    }

    setLoading(true)
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

    setLoading(false)
}

const LeftBarGeneration = ({review, navigate, location}) => {
    return(
        <div className={"left-bar"}>
            <div className={"button-up"} onClick={() => voteUpReview(review, navigate, location)}>^</div>
            <p className={"mark-text"}>{review.mark}</p>
            <div className={"button-down"} onClick={() => voteDownReview(review, navigate, location)}>v</div>
            <p className={"mark-text"}>{review.user.login}</p>
        </div>
    )

}

const SummaryGeneration = ({summary, setSummary, setLoading}) => {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const [inputValue, setInputValue] = useState("");
    const [inputRank, setInputRank] = useState(5);

    let navigate = useNavigate();

    return(
        <div className={"right-bar"}>
            <div className={"main-div-tools"}>
                <p className={"review-text"}>{summary.title} </p>
                <p className={"review-rating"} >Rating: {summary.rating.toFixed(2)} ★</p>
            </div>
            <plaintext className={"review-text-div"}>
                <pre>{summary.text} </pre>
            </plaintext>
            <div className={"main-div-tools"}>
                <p className={"review-text"} style={{marginBottom: "30px", width: "850px"}}>Author: {summary.user.login}</p>
                <div className={"rate-div"}>
                    <select className={"rate-select"} value={inputRank}
                            onChange={(event) => {setInputRank(event.target.value)}}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                    </select>
                    <div  className="review-rate-button"
                             onClick={() => rankSummary(summary, inputRank, navigate, location)}>Rate</div>
                </div>
            </div>
            <div className={"input-comment-div"}>
                <div>
                 <textarea className={"input-comment"} value={inputValue}
                         onChange={(event) => {setInputValue(event.target.value)}} type="text"/>
                </div>
                <div className={"input-comment-right-side"}>
                 <div style={{textAlign: "center"}} className={"submit-button"}  variant="success"
                         onClick={() => handleSubmit(summary, inputValue, setSummary, setLoading, user)} >Publish</div>
                </div>
            </div>
            {
                summary.review_data.map(review =>
                    <div className={"comment-div"} key={review.id}>
                        <LeftBarGeneration review={review} navigate={navigate} location={location} />
                        <textarea disabled className={"comment-text"}>{review.content}</textarea>
                    </div>).reverse()
            }
        </div>
    )
}

const Summary = () => {
    const location = useLocation();
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)

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
                <div className={"main-div-wrapper"}>
                    <SummaryGeneration  summary = {summary} setSummary = {setSummary} setLoading = {setLoading}/>
                </div>
            }
        </div>
    </div>
  );
}

export default Summary;