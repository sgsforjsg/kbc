import { useEffect, useState } from 'react';
import { auth, isSignInWithEmailLink, signInWithEmailLink } from '../firebase';

const CompleteSignIn = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const completeSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let emailForSignIn = window.localStorage.getItem('emailForSignIn');
        
        if (!emailForSignIn) {
          // If email is not available in localStorage, ask user to provide it
          emailForSignIn = window.prompt('Please provide your email for confirmation');
        }

        try {
          const result = await signInWithEmailLink(auth, emailForSignIn, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
          setMessage('Sign-in successful! Welcome ' + result.user.email);
        } catch (error) {
          console.error('Error during sign-in:', error);
          setMessage('Error during sign-in: ' + error.message);
        }
      }
    };

    completeSignIn();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">{message || 'Completing sign-in...'}</h1>
    </div>
  );
};

export default CompleteSignIn;
