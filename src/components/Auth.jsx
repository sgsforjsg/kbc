import { useState } from 'react';
import { auth, sendSignInLinkToEmail } from '../firebase';

const Auth = () => {
  const [email, setEmail] = useState("");

  const sendEmailLink = async () => {
    const actionCodeSettings = {
      // The URL to redirect to after the user clicks the link
      url: 'http://localhost:5173/complete-signin',
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Save the email in localStorage for later use
      window.localStorage.setItem('emailForSignIn', email);
      alert('Sign-in link sent!');
    } catch (error) {
      console.error("Error sending email link:", error);
      alert("Error sending email link: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Sign in with Email Link</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="p-2 border rounded mt-4"
      />
      <button onClick={sendEmailLink} className="bg-blue-500 text-white p-2 rounded mt-4">
        Send Sign-in Link
      </button>
    </div>
  );
};

export default Auth;
