import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthForm from "./components/AuthForm";
import CompleteSignup from "./components/CompleteSignup";
import LoggedInScreen from "./components/LoggedInScreen";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {user ? (
          // Show the logged-in screen if the user is authenticated
          <Route path="/" element={<LoggedInScreen />} />
        ) : (
          // Show the auth form if no user is authenticated
          <>
            <Route path="/" element={<AuthForm />} />
            <Route path="/complete-signup" element={<CompleteSignup />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
