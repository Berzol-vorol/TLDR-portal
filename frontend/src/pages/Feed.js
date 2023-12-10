import React, {useContext, useEffect, useState} from 'react';
import "./Feed.css"
import "./Header.css"
import Header from "./Header";
import Loading from "./Loading";
import { useNavigate } from 'react-router-dom';
import {AuthContext} from "../context/AuthContext";
import {fetchAllSummaries, fetchUserById} from "../services/service";


const CardGeneration = (project) => {
    let navigate = useNavigate();

    return(

        <div className={"main-div-card"}
            onClick={() => navigate("/project", { state: { projectId : project.project.id }})}>
            <div className={"main-div-tools"}>
                {/*<img className="card-profile-img" src={`data:image/svg+xml;base64,${btoa(avatar)}`}/>*/}
                    <div className={"main-div-tools"} style={{margin: "0"}}>
                        <p className={"main-div-minor-text"} style={{textAlign: "left"}}>
                            {project.project.user.login} | {project.project.user.rating.toFixed(2)} | {project.project.title}</p>
                    </div>
                <p className={"main-div-minor-text"} style={{pointerEvents: "none"}}>
                    {project.project.rating.toFixed(2)} ★ | Reviews Count: {project.project.reviews.length}</p>
            </div>
            <div className={"main-div-tools"}>
                <div className={"card-description"}>{project.project.description}</div>
            </div>
        </div>

    )
}

const SummariesPageGeneration = ({summary, page}) =>{
    let _summary = []

    for(let i = summary.length - 5*(page - 1) - 1; i > summary.length- 1 - 5*page && i >= 0; i--)
        _summary[i] = summary[i];

    return  (_summary.map((p) => {
            return <CardGeneration project={p}/>
        }
    ).reverse())
}

const PagesBarGeneration = ({summary, page, setPage, navigate}) => {
    let j = 0;
    let i = summary.length/5;
    let result = [];

    for(; i > 0; i--, j++){
        result[j] = j+1;
    }

    return(

        <div className={"main-div-page"} ><span style={{color: "chocolate"}} className={"main-div-page-text"}>(</span>
            {
                 result.map((res)=> {
                     if(res === page){
                         return <span style={{color: "wheat"}} className={"main-div-page-text"}
                            onClick={() => {
                                setPage(res)
                            }}>
                            {res}
                        </span>
                     }
                     else return (<span style={{color: "chocolate"}} className={"main-div-page-text"}
                        onClick={() => {
                            setPage(res)
                        }}>
                        {res}
                    </span>)
                })
            }<span style={{color: "chocolate"}} className={"main-div-page-text"}>)</span>
        </div>
    )
}

const Feed = () => {
    const auth = useContext(AuthContext)
    const [summary, setSummaries] = useState(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)

    let navigate = useNavigate();
        useEffect ( () => {

            const checkForAuth = async () => {
                if(auth.getUserId() == null){
                    navigate("/")
                }
            }
            const getSummariesForUser = async () => {
            const _summary = await fetchAllSummaries()
            for(let i = 0;i < _summary.length; i++) {
                _summary[i].user = await fetchUserById(_summary[i].creator);
            }
            setSummaries(_summary)
            setLoading(false)
            }

            checkForAuth()
            getSummariesForUser()
        },
        [auth, navigate]
    )

    return (
    <div>
        { Header() }
        <div className={"main-div"}>
            <div className={"main-div-tools"}>
                <p className={"main-div-major-text"}>New and Popular Code:</p>
            </div>
            <div className={"card-holder"}>
                {  loading ? <div className="company-name"><Loading/></div> :
                    <SummariesPageGeneration summary={summary} page={page}/>
                }

            </div>
            { loading ? <div className="company-name"> </div> :
                    <PagesBarGeneration   summary={summary} page={page} setPage = {setPage} navigate = {navigate} />
            }
        </div>
    </div>
  );
}

export default Feed;