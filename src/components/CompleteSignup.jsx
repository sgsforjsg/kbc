import { useEffect, useState } from "react";
import { auth, isSignInWithEmailLink, signInWithEmailLink, updatePassword } from "../firebase";

const CompleteSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let emailForSignIn = window.localStorage.getItem("emailForSignIn");
      if (!emailForSignIn) {
        emailForSignIn = window.prompt("Please provide your email for confirmation");
      }
      setEmail(emailForSignIn);
    }
  }, []);

  const completeSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Complete the sign-in with the email link
      const result = await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem("emailForSignIn");

      // Update user with password and any additional details
      await updatePassword(result.user, password);

      setMessage("Sign-up completed successfully! You can now log in.");
    } catch (error) {
      setError("Error during sign-up: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Complete Your Sign-Up</h1>
      <input
        type="email"
        value={email}
        disabled
        className="p-2 border rounded mt-4"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className="p-2 border rounded mt-4"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your password"
        className="p-2 border rounded mt-4"
      />
      <button
        onClick={completeSignUp}
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        Complete Sign-Up
      </button>

      {message && <p className="mt-4 text-green-500">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default CompleteSignup;
