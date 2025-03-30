
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import RegistrationForm from '@/components/forms/RegistrationForm';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Register = () => {
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const navigate = useNavigate();

  const handleRegistrationComplete = () => {
    setRegistrationComplete(true);
    toast({
      title: "Registration successful!",
      description: "Your account has been created. Welcome to Discover Diani!",
      duration: 5000,
    });
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-grow flex items-center py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-ocean-dark mb-2">
                Join Discover Diani
              </h1>
              <p className="text-gray-600">
                Create your account and unlock personalized recommendations for your Diani Beach adventure
              </p>
            </div>
            
            {registrationComplete ? (
              <div className="text-center py-12 max-w-md mx-auto">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600"
                  >
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-display font-semibold mb-2">Registration Complete!</h2>
                <p className="text-gray-600 mb-6">
                  Your account has been created successfully. Redirecting you to your dashboard...
                </p>
                <Button asChild className="bg-ocean hover:bg-ocean-dark">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            ) : (
              <>
                <RegistrationForm onComplete={handleRegistrationComplete} />
                
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-ocean hover:underline">
                      Log in here
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
