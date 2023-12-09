import React, {useContext, useEffect, useState} from 'react';
import "./Project.css"
import "./Header.css"
import Header from "./Header";
import Loading from "./Loading";
import { useNavigate } from 'react-router-dom'
import {AuthContext} from "../context/AuthContext";
import {fetchProject, fetchReview, fetchUserById, addReview, editReview, editProjectMark} from "../services/service";

const voteUpReview = async (review, navigate) => {
    let body = {
        id: review.id,
        content:  review.content,
        mark : review.mark + 1
    }

    await editReview(body)
    navigate.push({
        pathname : "/profile",
        state : navigate.location.state
    })

    navigate.push({
        pathname : "/project",
        state : navigate.location.state
    })

}

const voteDownReview = async (review, navigate) => {
    review.mark--;

    await editReview(review)

    navigate.push({
        pathname: "/profile",
        state: navigate.location.state
    })

    navigate.push({
        pathname: "/project",
        state: navigate.location.state
    })
}

const rankProject = async (project, mark, navigate) => {
    project.mark = mark;

    await editProjectMark(project);

    navigate.push({
        pathname: "/profile",
        state: navigate.location.state
    })

    navigate.push({
        pathname: "/project",
        state: navigate.location.state
    })
}


const handleSubmit = async (project, inputValue, setProject, setLoading, auth) => {
    if(inputValue === "")
        return;
    let new_review = {
        content: inputValue,
        project: project.id,
        creator: auth.getUserId(),
    }

    setLoading(true)
    await addReview(new_review);
    const _project = await fetchProject(project.id);

    project.reviews.push(_project.reviews[_project.reviews.length-1])

    let review = await fetchReview(project.reviews[project.reviews.length-1]);
    project.review_data.push(review)
    project.review_data[project.review_data.length-1].user = new_review.creator
    // for(let i = 0;i < _project.reviews.length; i++) {
    //     _project.review_data[j] = await fetchReview(_project.reviews[i]);
    //     _project.review_data[j].user = await fetchUserById(_project.review_data[j].creator);
    // }
    //setProject(_project);

    setLoading(false)
}

const LeftBarGeneration = ({review, navigate}) => {
    return(
        <div className={"left-bar"}>
            <div className={"button-up"} onClick={() => voteUpReview(review, navigate)}>^</div>
            <p className={"mark-text"}>{review.mark}</p>
            <div className={"button-down"} onClick={() => voteDownReview(review, navigate)}>v</div>
            <p className={"mark-text"}>{review.user.login}</p>
        </div>
    )

}

const ProjectGeneration = ({project, setProject, setLoading}) => {
    const auth = useContext(AuthContext);
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
                             onClick={() => rankProject(project, inputRank, navigate)}>Rate</div>
                </div>
            </div>
            <div className={"input-comment-div"}>
                <div>
                 <textarea className={"input-comment"} value={inputValue}
                         onChange={(event) => {setInputValue(event.target.value)}} type="text"/>
                </div>
                <div className={"input-comment-right-side"}>
                 <div style={{textAlign: "center"}} className={"submit-button"}  variant="success"
                         onClick={() => handleSubmit(project, inputValue, setProject, setLoading, auth)} >Publish</div>
                </div>
            </div>
            {
                project.review_data.map(review =>
                    <div className={"comment-div"} key={review.id}>
                        <LeftBarGeneration review={review} navigate={navigate} />
                        <textarea disabled className={"comment-text"}>{review.content}</textarea>
                    </div>).reverse()
            }
        </div>
    )
}

const Project = () => {
    const auth = useContext(AuthContext);

    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)

    let navigate = useNavigate();
        useEffect ( () => {
            const checkAuth = async () => {
                if(auth.getUserId() == null){
                    navigate.push("/")
                }
            }
            const getProjectForUser = async () => {
                const _project = await fetchProject(navigate.location.state)
                _project.user = await fetchUserById(_project.creator);
                _project.review_data = [];
                for(let i = 0;i < _project.reviews.length; i++) {
                    let review = await fetchReview(_project.reviews[i]);
                    review.user = await fetchUserById(review.creator);
                    _project.review_data.push(review);
                }
                setProject(_project)
                setLoading(false)
            }
            checkAuth()
            getProjectForUser()
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
                    <ProjectGeneration  project = {project} setProject = {setProject} setLoading = {setLoading}/>
                </div>
            }
        </div>
    </div>
  );
}

export default Project;