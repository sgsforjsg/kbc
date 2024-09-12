import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AuthForm = () => {
  const { login, sendEmailLink, resetPassword } = useAuth(); // Access auth context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and registration

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      setError("Login Error: " + error.message);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await resetPassword(email);
      setMessage("Password reset email sent!");
    } catch (error) {
      setError("Forgot Password Error: " + error.message);
    }
  };

  const handleRegistrationLink = async () => {
    try {
      await sendEmailLink(email);
      window.localStorage.setItem("emailForSignIn", email);
      setMessage("Sign-in link sent to your email!");
    } catch (error) {
      setError("Registration Error: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">
        {isLogin ? "Login" : "Sign Up with Email Link"}
      </h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="p-2 border rounded mt-4"
      />
      {isLogin && (
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="p-2 border rounded mt-4"
        />
      )}

      <button
        onClick={isLogin ? handleLogin : handleRegistrationLink}
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        {isLogin ? "Login" : "Send Registration Link"}
      </button>

      {isLogin && (
        <p
          className="mt-4 cursor-pointer text-blue-500"
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </p>
      )}

      <p
        className="mt-4 cursor-pointer text-blue-500"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Sign Up with Email Link" : "Back to Login"}
      </p>

      {message && <p className="mt-4 text-green-500">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default AuthForm;
