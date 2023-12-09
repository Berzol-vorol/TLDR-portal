import React, { useEffect, useState, useContext } from 'react';
import "./Header.css"
import "./Profile.css"
import Header from "./Header"
import Loading from "./Loading";
import { fetchProjectsForUser, fetchUserById } from "../services/service";
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';

const logoutHandle = (navigate, auth) => {
    auth.logout();
    navigate.push("/")
}

const ViewProject = ({project, navigate}) => {
    return(
            <div className="project" onClick={() => navigate.push({
                    pathname : "/project",
                    state : project.id
                })}>
                <p className="project-text">{ project.title }</p>
                <p className="project-text">Rating: { project.rating.toFixed(2) }</p>
                <p className="project-text">Reviews: { project.reviews.length }</p>
            </div>
    )
}

const Profile = () => {
    const auth = useContext(AuthContext);
    const [projects, setProjects] = useState(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    let navigate = useNavigate();


    useEffect (() => {
        const checkForAuth = async () => {
            if(auth.getUserId() == null){
                navigate.push("/")
            }
        }

        const getUser = async () => {
            const _user = await fetchUserById(auth.getUserId())
            setUser(_user)

            const _projects = await fetchProjectsForUser(auth.getUserId())
            setProjects(_projects)
            if(_projects == null){
                setProjects([])
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
                    <div className="project-button" onClick={() => navigate.push("/push_project")}>
                        <p className="add-project-text">Add project</p>
                    </div>

                    <div className="project-button" onClick={() => logoutHandle(navigate, auth)}>
                            <p className="add-project-text">Log out</p>
                    </div>

                </div>
                <div className="main-content-right">
                    <div className="projects-holder">
                        { loading ? <div className="company-name"><Loading/></div> :
                            projects.map(
                                (project) => {
                                    return <ViewProject project={project} navigate={navigate}/>
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