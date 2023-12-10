import React, {useContext, useEffect, useState} from 'react';
import "./Summary.css"
import "./Header.css"
import Header from "./Header";
import Loading from "./Loading";
import { useNavigate, useLocation } from 'react-router-dom'
import {AuthContext} from "../context/AuthContext";
import {fetchSummary, fetchReview, fetchUserById, addReview, editReview, editSummaryMark} from "../services/service";

const voteUpReview = async (review, navigate, location) => {
    let body = {
        id: review.id,
        content:  review.content,
        mark : review.mark + 1
    }

    await editReview(body)
    navigate("/profile", {state : location.state})

    navigate("/project", {state : location.state})

}

const voteDownReview = async (review, navigate, location) => {
    review.mark--;

    await editReview(review)

    navigate("/profile", {state: location.state})

    navigate("/project", {state: location.state})
}

const rankSummary = async (project, mark, navigate, location) => {
    project.mark = mark;

    await editSummaryMark(project);

    navigate("/profile", {state: location.state})

    navigate("/project", {state: location.state})
}


const handleSubmit = async (project, inputValue, setSummary, setLoading, auth) => {
    if(inputValue === "")
        return;
    let new_review = {
        content: inputValue,
        project: project.id,
        creator: auth.getUserId(),
    }

    setLoading(true)
    await addReview(new_review);
    const _project = await fetchSummary(project.id);

    project.reviews.push(_project.reviews[_project.reviews.length-1])

    let review = await fetchReview(project.reviews[project.reviews.length-1]);
    project.review_data.push(review)
    project.review_data[project.review_data.length-1].user = new_review.creator
    // for(let i = 0;i < _project.reviews.length; i++) {
    //     _project.review_data[j] = await fetchReview(_project.reviews[i]);
    //     _project.review_data[j].user = await fetchUserById(_project.review_data[j].creator);
    // }
    //setSummary(_project);

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

const SummaryGeneration = ({project, setSummary, setLoading}) => {
    const auth = useContext(AuthContext);
    const location = useLocation();
    const [inputValue, setInputValue] = useState("");
    const [inputRank, setInputRank] = useState(5);

    let navigate = useNavigate();

    return(
        <div className={"right-bar"}>
            <div className={"main-div-tools"}>
                <p className={"review-text"}>{project.title} </p>
                <p className={"review-rating"} >Rating: {project.rating.toFixed(2)} ★</p>
            </div>
            <plaintext className={"review-text-div"}>
                <pre>{project.code} </pre>
            </plaintext>
            <div className={"main-div-tools"}>
                <p className={"review-text"} style={{marginBottom: "30px", width: "850px"}}>Author: {project.user.login}</p>
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
                             onClick={() => rankSummary(project, inputRank, navigate, location)}>Rate</div>
                </div>
            </div>
            <div className={"input-comment-div"}>
                <div>
                 <textarea className={"input-comment"} value={inputValue}
                         onChange={(event) => {setInputValue(event.target.value)}} type="text"/>
                </div>
                <div className={"input-comment-right-side"}>
                 <div style={{textAlign: "center"}} className={"submit-button"}  variant="success"
                         onClick={() => handleSubmit(project, inputValue, setSummary, setLoading, auth)} >Publish</div>
                </div>
            </div>
            {
                project.review_data.map(review =>
                    <div className={"comment-div"} key={review.id}>
                        <LeftBarGeneration review={review} navigate={navigate} location={location} />
                        <textarea disabled className={"comment-text"}>{review.content}</textarea>
                    </div>).reverse()
            }
        </div>
    )
}

const Summary = () => {
    const auth = useContext(AuthContext);
    const location = useLocation();
    const [project, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)

    let navigate = useNavigate();
        useEffect ( () => {
            const checkAuth = async () => {
                if(auth.getUserId() == null){
                    navigate("/")
                }
            }
            const getSummaryForUser = async () => {
                const _project = await fetchSummary(location.state.projectId)
                _project.user = await fetchUserById(_project.creator);
                _project.review_data = [];
                for(let i = 0;i < _project.reviews.length; i++) {
                    let review = await fetchReview(_project.reviews[i]);
                    review.user = await fetchUserById(review.creator);
                    _project.review_data.push(review);
                }
                setSummary(_project)
                setLoading(false)
            }
            checkAuth()
            getSummaryForUser()
        },
        [auth, navigate]
    )
    return (
    <div>
           { Header() }
        <div className={"main-div"}>
            { loading ?
                <div className={"main-div-wrapper"}>
                    <Loading/>
                </div>
                :
                <div className={"main-div-wrapper"}>
                    <SummaryGeneration  project = {project} setSummary = {setSummary} setLoading = {setLoading}/>
                </div>
            }
        </div>
    </div>
  );
}

export default Summary;