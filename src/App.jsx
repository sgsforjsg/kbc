import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import AuthForm from "./components/AuthForm";
import CompleteSignup from "./components/CompleteSignup";
import LoggedInScreen from "./components/LoggedInScreen";
import AdminPage from "./pages/AdminPage";
import AddDataFromJSON from "./components/AddDataFromJSON"; 
import ManageQuestions from "./components/ManageQuestions";
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
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/add-data" element={<AddDataFromJSON />} />
              
              <Route path="/manageq" element={<ManageQuestions />} />

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
