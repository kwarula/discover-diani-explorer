import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Assuming Tabs are used
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming Card structure
// Import the actual form components
import OperatorLoginForm from '@/components/forms/OperatorLoginForm';
import OperatorRegistrationForm from '@/components/forms/OperatorRegistrationForm';

const OperatorAuth: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOperator, setIsCheckingOperator] = useState(true);

  useEffect(() => {
    console.log("OperatorAuth useEffect: Running. isAuthLoading:", isAuthLoading, "User:", !!user); // Log start

    // Don't run check until auth state is resolved
    if (isAuthLoading) {
      console.log("OperatorAuth useEffect: Auth is loading, setting isCheckingOperator=true and returning.");
      setIsCheckingOperator(true); // Ensure we check again if auth loading state changes
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
            .maybeSingle(); // Use maybeSingle to handle 0 or 1 result

          if (error) {
            console.log("checkOperatorProfile: Supabase query finished. Error:", error, "Data:", data);
            console.log("checkOperatorProfile: Supabase query finished. Error:", error, "Data:", data);
            console.error('checkOperatorProfile: Error checking operator profile:', error);
            console.log("checkOperatorProfile: Setting isCheckingOperator=false before navigating (error case).");
            setIsCheckingOperator(false); // Set state BEFORE navigating
            console.log("checkOperatorProfile: Navigating to /operator/onboarding due to error.");
            navigate('/operator/onboarding');
          } else if (data) {
             console.log("checkOperatorProfile: Supabase query finished. Error:", error, "Data:", data);
             console.log("checkOperatorProfile: Setting isCheckingOperator=false before navigating (profile found).");
             setIsCheckingOperator(false); // Set state BEFORE navigating
            console.log("checkOperatorProfile: Operator profile found. Navigating to /operator/dashboard.");
            navigate('/operator/dashboard');
          } else {
             console.log("checkOperatorProfile: Supabase query finished. Error:", error, "Data:", data);
             console.log("checkOperatorProfile: Setting isCheckingOperator=false before navigating (no profile found).");
             setIsCheckingOperator(false); // Set state BEFORE navigating
            console.log("checkOperatorProfile: No operator profile found. Navigating to /operator/onboarding.");
            navigate('/operator/onboarding');
          }
        } catch (err) {
           console.error('checkOperatorProfile: Unexpected error:', err);
           console.log("checkOperatorProfile: Setting isCheckingOperator=false before navigating (unexpected error).");
           setIsCheckingOperator(false); // Set state BEFORE navigating
           console.log("checkOperatorProfile: Navigating to /operator/onboarding due to unexpected error.");
           navigate('/operator/onboarding'); // Fallback?
        } finally {
           // Fallback in case navigation didn't happen or state wasn't set before
           if (isCheckingOperator) { // Only set if it wasn't already set before navigate
              console.log("checkOperatorProfile: Finally block reached. Setting isCheckingOperator=false (fallback).");
              setIsCheckingOperator(false);
           }
        }
      };
      checkOperatorProfile();
    } else {
      console.log("OperatorAuth useEffect: No user found, setting isCheckingOperator=false.");
      // User is not logged in, finished checking (they need to log in/sign up)
      setIsCheckingOperator(false);
    }
  }, [user, isAuthLoading, navigate]);


  // Show loading indicator while checking auth or operator status
  if (isAuthLoading || isCheckingOperator) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <div>Loading...</div> {/* Replace with a proper spinner/skeleton */}
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

  // If user is logged in but the check hasn't redirected yet (should be brief)
  // Or if there was an error during the check that didn't redirect
  return (
     <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <div>Verifying Operator Status...</div> {/* Fallback content */}
     </div>
  );
};

export default OperatorAuth;
