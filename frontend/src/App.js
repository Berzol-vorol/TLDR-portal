import './App.css';

import Feed from "./pages/Feed"
import Profile from "./pages/Profile"
import Push_summary from "./pages/Push_summary"
import Summary from "./pages/Summary";
import Sign_in from "./pages/Sign_in"
import Sign_up from './pages/Sign_up';
import {AuthContext} from './context/AuthContext';
import {useAuth} from "./hooks/auth-hook";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  const { login, logout, getUserId } = useAuth();
  return (
    <AuthContext.Provider
        value={{
          getUserId: getUserId,
          login: login,
          logout: logout
        }}
    >
      <Router>
          <Routes>
            <Route path="/" exact element={<Sign_in />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/sign_up" element={<Sign_up />} />
            <Route path="/push_summary" element={<Push_summary />}/>
          </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
