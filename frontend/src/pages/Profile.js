import React, { useEffect, useState, useContext } from 'react';
import "./Header.css"
import "./Profile.css"
import Header from "./Header"
import Loading from "./Loading";
import { fetchSummariesForUser, fetchUserById } from "../services/service";
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';

const logoutHandle = (navigate, auth) => {
    auth.logout();
    navigate("/")
}

const ViewSummary = ({summary, navigate}) => {
    return(
            <div className="summary" onClick={() => navigate("/summary", { state : summary.id })}>
                <p className="summary-text">{ summary.title }</p>
                <p className="summary-text">Rating: { summary.rating.toFixed(2) }</p>
                <p className="summary-text">Reviews: { summary.reviews.length }</p>
            </div>
    )
}

const Profile = () => {
    const auth = useContext(AuthContext);
    const [summary, setSummaries] = useState(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    let navigate = useNavigate();


    useEffect (() => {
        const checkForAuth = async () => {
            if(auth.getUserId() == null){
                navigate("/")
            }
        }

        const getUser = async () => {
            const _user = await fetchUserById(auth.getUserId())
            setUser(_user)

            const _summary = await fetchSummariesForUser(auth.getUserId())
            setSummaries(_summary)
            if(_summary == null){
                setSummaries([])
            }
            setLoading(false)
        }

        checkForAuth()
        getUser()
        },
        [auth, navigate]
    )
    return (

    <div>
        { Header() }
        <div className="main">
            <div className="main-content">
                <div className="main-content-left">
                    {loading ? <Loading/> :
                        <div>
                            <p className="profile-text">{user.login}</p>
                            <p className="profile-text">Rating: {user.rating.toFixed(2)}</p>
                        </div>
                    }
                    <div className="summary-button" onClick={() => navigate("/push_summary")}>
                        <p className="add-summary-text">Add summary</p>
                    </div>

                    <div className="summary-button" onClick={() => logoutHandle(navigate, auth)}>
                            <p className="add-summary-text">Log out</p>
                    </div>

                </div>
                <div className="main-content-right">
                    <div className="summary-holder">
                        { loading ? <div className="company-name"><Loading/></div> :
                            summary.map(
                                (summary) => {
                                    return <ViewSummary summary={summary} navigate={navigate}/>
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