import React, {useContext, useEffect, useState} from 'react';
import "./Feed.css"
import "./Header.css"
import Header from "./Header";
import Loading from "./Loading";
import { useNavigate } from 'react-router-dom';
import {UserContext} from "../context/UserContext";
import {fetchAllSummaries, fetchUserById} from "../services/service";


const CardGeneration = (summary) => {
    let navigate = useNavigate();

    return(

        <div className={"main-div-card"}
            onClick={() => navigate("/summary", { state: { summaryId : summary.summary.id }})}>
            <div className={"main-div-tools"}>
                {/*<img className="card-profile-img" src={`data:image/svg+xml;base64,${btoa(avatar)}`}/>*/}
                    <div className={"main-div-tools"} style={{margin: "0"}}>
                        <p className={"main-div-minor-text"} style={{textAlign: "left"}}>
                            {summary.summary.user.login} | {summary.summary.user.rating.toFixed(2)} | {summary.summary.title}</p>
                    </div>
                <p className={"main-div-minor-text"} style={{pointerEvents: "none"}}>
                    {summary.summary.rating.toFixed(2)} ★ | Reviews Count: {summary.summary.reviews.length}</p>
            </div>
            <div className={"main-div-tools"}>
                <div className={"card-description"}>{summary.summary.description}</div>
            </div>
        </div>

    )
}

const SummariesPageGeneration = ({summaries, page}) =>{
    let _summaries = []

    for(let i = summaries.length - 5*(page - 1) - 1; i > summaries.length- 1 - 5*page && i >= 0; i--)
        _summaries[i] = summaries[i];

    return  (_summaries.map((s) => {
            return <CardGeneration summary={s}/>
        }
    ).reverse())
}

const PagesBarGeneration = ({summaries, page, setPage, navigate}) => {
    let j = 0;
    let i = summaries.length/5;
    let result = [];

    for(; i > 0; i--, j++){
        result[j] = j+1;
    }

    return(

        <div className={"main-div-page"} ><span style={{color: "chocolate"}} className={"main-div-page-text"}>(</span>
            {
                 result.map((res)=> {
                     if(res === page){
                         return <span style={{color: "wheat"}} className={"main-div-page-text"} key={res}
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
    const [summaries, setSummaries] = useState(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)

    let navigate = useNavigate();
        useEffect ( () => {
            const getSummariesForUser = async () => {
            const _summaries = await fetchAllSummaries()
            for(let i = 0; i < _summaries.length; i++) {
                _summaries[i].user = await fetchUserById(_summaries[i].creator);
            }
            setSummaries(_summaries)
            setFilteredData(_summaries)
            setLoading(false)
            }
            getSummariesForUser()
        },
        [navigate]
    )

    useEffect(() => {
        if (loading === false) {
            const filtered = summaries.filter(item =>
                Object.values(item).some(value => value.toString().toLowerCase().includes(searchNameTerm.toLowerCase()))
            );
            setFilteredData(filtered);
        }
    }, [summaries, searchNameTerm]);


    const handleSearch = event => {
        setSearchNameTerm(event.target.value);
    };

    return (
    <div>
        { Header() }
        <div className={"main-div"}>
            <div className={"main-div-tools"}>
                <p className={"main-div-major-text"}>New and Popular Code:</p>
                <input
                    type="text"
                    value={searchNameTerm}
                    placeholder="Find by name"
                    onChange={handleSearch}
                    className={"custom-input"}
                />
            </div>
            <div className={"card-holder"}>
            {  loading ? <div className="company-name"><Loading/></div> :
                <SummariesPageGeneration summaries={filteredData} page={page}/>
            }

            </div>
            { loading ? <div className="company-name"> </div> :
                <PagesBarGeneration summaries={summaries} page={page} setPage = {setPage} navigate = {navigate} />
            }
        </div>
    </div>
  );
}

export default Feed;