import React, { useEffect, useState, useContext } from 'react';
import "./Header.css"
import "./Profile.css"
import Header from "./Header"
import Loading from "./Loading";
import { fetchSummariesForUser } from "../services/service";
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext';

const ViewSummary = ({summary, navigate}) => {
    return(
        <div className="summary" onClick={() => navigate("/summary", { state: { summaryId: summary.id }})}>
            <p className="summary-text">{ summary.title }</p>
            <p className="summary-text">Rating: { summary.rating.toFixed(2) }</p>
            <p className="summary-text">Reviews: { summary.reviews.length }</p>
        </div>
    )
}

const Profile = () => {
    const { user, logout } = useContext(UserContext);
    const [summaries, setSummaries] = useState(null)
    const [loading, setLoading] = useState(true)
    let navigate = useNavigate();

    useEffect ( () => {
        const checkForAuth = async () => {
            if(user == null){
                navigate("/")
            }
        }

        const getSummaries = async () => {
            const _summaries = await fetchSummariesForUser(user.id)
            setSummaries(_summaries)
            if(_summaries == null){
                setSummaries([])
            }
            setLoading(false)
        }

        checkForAuth();
        getSummaries();
        },
        [navigate]
    )

    const logoutHandle = () => {
        logout();
        navigate("/");
    }

    return (
    <div>
        { Header() }
        <div className="main">
            <div className="main-content">
                <div className="main-content-left">
                    {loading ? <Loading/> :
                        <div>
                            <p className="profile-text">Hello {user.login}!</p>
                            <p className="profile-text-secondary">{user.email}</p>
                            <p className="profile-text">Rating: {user.rating.toFixed(2)}</p>
                        </div>
                    }
                    <div className={"main-div-button"} onClick={() => navigate("/push_summary")}>Add summary</div>
                </div>
                <div className="main-content-right">
                    <div className="summary-holder">
                        { loading ? <div className="company-name"><Loading/></div> :
                            summaries.map(
                                (s) => {
                                    return <ViewSummary summary={s} navigate={navigate}/>
                                }
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>

  );
}

export default Profile;