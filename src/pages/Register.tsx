
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTourist, setIsTourist] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const { toast } = useToast();
  
  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      await signUp(email, password, {
        full_name: fullName,
        is_tourist: isTourist,
      });
      
      toast({
        title: 'Registration successful',
        description: 'Please complete your profile in the dashboard',
      });
      
      // The auth state listener in AuthContext will handle redirecting to dashboard
    } catch (error: any) {
      setError(error.message || 'Failed to sign up');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-ocean-dark">Create an account</CardTitle>
            <CardDescription className="text-center">
              Sign up to get personalized recommendations for Diani Beach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isTourist"
                  checked={isTourist}
                  onCheckedChange={(checked) => setIsTourist(checked as boolean)}
                />
                <Label htmlFor="isTourist" className="text-sm">
                  I am a tourist visiting Diani Beach
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-ocean hover:bg-ocean-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : 'Create account'}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center w-full text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-ocean hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
