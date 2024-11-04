import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import AuthForm from "./components/AuthForm";
import CompleteSignup from "./components/CompleteSignup";
import LoggedInScreen from "./components/LoggedInScreen";
import AdminPage from "./pages/AdminPage";
import GameSetup from "./pages/GameSetup";
import MillionaireGame from "./pages/MillionaireGame";
import AddDataFromJSON from "./components/AddDataFromJSON"; 
import EditData from "./components/AddAndEditData"; 
import ManageQuestions from "./components/ManageQuestions";
import DownloadMediaFiles from "./components/DownloadMediaFiles";
import GameConsole from './pages/GameConsole'; // Your GameConsole component
import Home from "./pages/Home";

function App() {
  const { user, userData } = useAuth(); // userData contains the role

  return (
    <Router>
      <Navbar />
      <Routes>
        {user ? (
          <>
            {/* Protected route for logged-in users */}
            <Route path="/" element={<LoggedInScreen />} />

            {/* Admin route only visible to admin users */}
            {userData?.role === "admin" && (

              <>

              <Route path="home" element={<Home/>}/>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/game" element={<GameSetup />} />
              <Route path="/game-console" element={<GameConsole />} />
              <Route path="/add-data" element={<AddDataFromJSON />} />
              <Route path="/edit" element={<EditData />} />
              <Route path="/dl_media" element={< DownloadMediaFiles/>} />
              <Route path="/manageq" element={<ManageQuestions />} />
              <Route path="/game2" element={<MillionaireGame/>}/>

              </>
            )}
          </>
        ) : (
          <>
            {/* Routes for unauthenticated users */}
            <Route path="/" element={<AuthForm />} />
            <Route path="/complete-signup" element={<CompleteSignup />} />
          </>
        )}

        {/* Fallback route for 404 */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
