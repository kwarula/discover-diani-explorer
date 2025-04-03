
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff } from 'lucide-react'; // Import Eye icons
import { Label } from '@/components/ui/label';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
// Assuming you have a Google icon component or SVG
// import GoogleIcon from '@/components/icons/GoogleIcon'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [emailError, setEmailError] = useState(''); // State for email field error
  const [passwordError, setPasswordError] = useState(''); // State for password field error
  
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithProvider, user, isSigningIn } = useAuth();
  
  const from = location.state?.from?.pathname || '/dashboard';
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError('');
    setPasswordError('');

    if (!email || !password) {
      // You could set specific errors here if desired, e.g., setEmailError('Email is required')
      setPasswordError('Please fill in all fields'); // Or a general message in one field
      return;
    }
    
    try {
      const result = await signIn(email, password);
      if (!result.success && result.error) {
        // Basic error routing - adjust based on actual Supabase error messages
        if (result.error.includes('Invalid login credentials')) {
          setPasswordError(result.error);
        } else if (result.error.includes('Email not confirmed') || result.error.includes('User not found')) {
          setEmailError(result.error);
        } else {
          // Fallback for unexpected errors
          setPasswordError(result.error); 
        }
      }
      // Redirect is handled by useEffect
    } catch (error: any) {
      const message = error.message || 'Failed to sign in';
      setPasswordError(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Subtle background gradient */}
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm"> {/* Added slight transparency */}
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-ocean-dark">Log in to Discover Diani</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Removed general error display */}
              
              <div className="space-y-1"> {/* Reduced space */}
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-invalid={!!emailError} // For accessibility
                  aria-describedby="email-error"
                />
                {emailError && <p id="email-error" className="text-sm text-red-600 mt-1">{emailError}</p>}
              </div>
              
              <div className="space-y-1"> {/* Reduced space */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="#" className="text-sm text-ocean hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative"> {/* Wrapper for input + icon */}
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'} // Toggle type
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-invalid={!!passwordError} // For accessibility
                    aria-describedby="password-error"
                    className="pr-10" // Add padding for the icon
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                 {passwordError && <p id="password-error" className="text-sm text-red-600 mt-1">{passwordError}</p>}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-ocean hover:bg-ocean-dark"
                disabled={isSigningIn}
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : 'Log in'}
              </Button>
              
              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login Button */}
              <Button 
                variant="outline" 
                className="w-full" 
                type="button" 
                onClick={() => signInWithProvider('google')}
              >
                {/* Replace with actual Google Icon */}
                <svg className="mr-2 h-4 w-4" /* ...props for Google icon */ viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.1v2.7h5.1c-.2 1.1-.9 2.1-2.1 2.8v1.8h2.3c1.4-1.3 2.2-3.2 2.2-5.3 0-.6-.1-1.1-.2-1.7zM12.25 22c2.4 0 4.5-.8 6-2.2l-2.3-1.8c-.8.5-1.8.8-3.1.8-2.4 0-4.4-1.6-5.1-3.8H4.1v1.8C5.8 19.9 8.8 22 12.25 22zM4.1 14.3v-1.8c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V7.1H1.9C1.1 8.6 1 10.3 1 12s.1 3.4 1.1 4.9l2.1-1.6zM12.25 6c1.3 0 2.5.5 3.4 1.4l2-2C16.1 3.7 14.3 3 12.25 3 8.8 3 5.8 5.1 4.1 7.1l2.3 1.8c.7-2.2 2.7-3.9 5.1-3.9z"/></svg>
                Google
              </Button>
              {/* Add buttons for other providers (Facebook, Apple) here if needed */}

            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2"> {/* Reduced space */}
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-ocean hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
