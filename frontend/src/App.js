import './App.css';
import { useState, useEffect } from 'react';
import Feed from "./pages/Feed"
import Profile from "./pages/Profile"
import Push_summary from "./pages/Push_summary"
import Summary from "./pages/Summary";
import Sign_in from "./pages/Sign_in"
import Sign_up from './pages/Sign_up';
import Protected from './pages/Protected';

import { UserProvider, useAuth } from './context/UserContext';

import {fetchUserById, fetchUserByToken} from "./services/service";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import axios from "axios";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [token, setToken_] = useState(localStorage.getItem("token"));
    const { user, setUser, setToken } = useAuth();

    const fetchUser = async () => {
        const result = await fetchUserByToken(token);
        console.log(result);
        if (result.success) {
            console.log(result.userId);
            const user_ = await fetchUserById(result.userId);
            console.log(user_);
            setUser(user_);
            setIsLoggedIn(true);
        }
        else {
            setIsLoggedIn(false);
        }
    }

    useEffect(() => {
        if (user) {
            setUser(user);
            setIsLoggedIn(true);
        } else {
            if (token) {
                axios.defaults.headers.common["Authorization"] = "Bearer " + token;
                localStorage.setItem('token',token);
                setToken(token);

                fetchUser().catch(console.error);
                console.log(user);
            }
            else {
                delete axios.defaults.headers.common["Authorization"];
                localStorage.removeItem('token')
                setIsLoggedIn(false);
            }
        }
    }, [user, token, fetchUser]);

    return (
    <UserProvider>
      <Router>
          <Routes>
            <Route path="/" exact element={<Feed />} />
            <Route path="/profile" element={
                <Protected isLoggedIn={isLoggedIn}>
                    <Profile />
                </Protected>
            }/>
            <Route path="/summary" element={<Summary />} />
            <Route path="/sign_in" element={<Sign_in />} />
            <Route path="/sign_up" element={<Sign_up />} />
            <Route path="/push_summary" element={
                <Protected isLoggedIn={isLoggedIn}>
                    <Push_summary />
                </Protected>
            }/>
          </Routes>
      </Router>
    </UserProvider>
    );
}

export default App;
