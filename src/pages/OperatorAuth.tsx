
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import OperatorLoginForm from '@/components/forms/OperatorLoginForm';
import OperatorRegistrationForm from '@/components/forms/OperatorRegistrationForm';

const OperatorAuth: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOperator, setIsCheckingOperator] = useState(true);

  useEffect(() => {
    console.log("OperatorAuth useEffect: Running. isAuthLoading:", isAuthLoading, "User:", !!user);

    // Don't run check until auth state is resolved
    if (isAuthLoading) {
      console.log("OperatorAuth useEffect: Auth is loading, setting isCheckingOperator=true and returning.");
      setIsCheckingOperator(true);
      return;
    }

    console.log("OperatorAuth useEffect: Auth finished loading.");

    if (user) {
      console.log("OperatorAuth useEffect: User found, starting checkOperatorProfile.");
      // User is logged in, check if they have an operator profile
      const checkOperatorProfile = async () => {
        console.log("checkOperatorProfile: Setting isCheckingOperator=true.");
        setIsCheckingOperator(true);
        try {
          console.log("checkOperatorProfile: Querying Supabase for operator profile...");
          const { data, error } = await supabase
            .from('operators')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle() as any;

          if (error) {
            console.log("checkOperatorProfile: Supabase query finished. Error:", error, "Data:", data);
            console.error('checkOperatorProfile: Error checking operator profile:', error);
            setIsCheckingOperator(false);
            navigate('/operator/onboarding');
          } else if (data) {
            console.log("checkOperatorProfile: Supabase query finished. Error:", error, "Data:", data);
            setIsCheckingOperator(false);
            navigate('/operator/dashboard');
          } else {
            console.log("checkOperatorProfile: Supabase query finished. Error:", error, "Data:", data);
            setIsCheckingOperator(false);
            navigate('/operator/onboarding');
          }
        } catch (err) {
          console.error('checkOperatorProfile: Unexpected error:', err);
          setIsCheckingOperator(false);
          navigate('/operator/onboarding');
        } finally {
          if (isCheckingOperator) {
            console.log("checkOperatorProfile: Finally block reached. Setting isCheckingOperator=false (fallback).");
            setIsCheckingOperator(false);
          }
        }
      };
      checkOperatorProfile();
    } else {
      console.log("OperatorAuth useEffect: No user found, setting isCheckingOperator=false.");
      setIsCheckingOperator(false);
    }
  }, [user, isAuthLoading, navigate]);

  // Show loading indicator while checking auth or operator status
  if (isAuthLoading || isCheckingOperator) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If not loading and no user, show Login/Signup forms
  if (!user) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Operator Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-4">
                <OperatorLoginForm />
              </TabsContent>
              <TabsContent value="signup" className="mt-4">
                <OperatorRegistrationForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback content
  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
      <div>Verifying Operator Status...</div>
    </div>
  );
};

export default OperatorAuth;
