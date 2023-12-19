import './App.css';
import Feed from "./pages/Feed"
import Profile from "./pages/Profile"
import Push_summary from "./pages/Push_summary"
import Summary from "./pages/Summary";
import Sign_in from "./pages/Sign_in"
import Sign_up from './pages/Sign_up';
import Protected from './pages/Protected';

import { SpeedInsights } from '@vercel/speed-insights/react';

import { UserProvider, useLoggedIn } from './context/UserContext';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App({user, token}) {
    return (
    <UserProvider user={user} token={token}>
        <AppRouter/>
    </UserProvider>
    );
}

function AppRouter() {
    const isLoggedIn = useLoggedIn();

    return (
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
        <SpeedInsights />
    </Router>
    )
}

export default App;
