import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const AuthForm: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-green-600">
      <div className="w-full max-w-md">
        <SignIn 
          routing="hash"
          signUpUrl="#/sign-up"
          afterSignInUrl="/"
        />
      </div>
    </div>
  );
};

export default AuthForm;