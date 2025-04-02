import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label'; // Keep Label for the Checkbox
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Define Zod schema for validation
const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  confirmPassword: z.string(),
  isTourist: z.boolean().default(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Set error path to confirmPassword field
});

type RegisterFormValues = z.infer<typeof formSchema>;

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(''); // For general form errors (e.g., API errors)
  
  const navigate = useNavigate();
  const { signUp, user } = useAuth();

  // Initialize react-hook-form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      isTourist: true,
    },
  });
  
  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Updated submit handler using react-hook-form
  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    setFormError(''); // Clear previous form errors
    
    try {
      await signUp(values.email, values.password, {
        full_name: values.fullName,
        is_tourist: values.isTourist,
      });
      
      toast.success('Registration successful! Redirecting to dashboard...');
      
      // No explicit redirect needed here if AuthProvider handles it on user state change
      // navigate('/dashboard', { replace: true }); // Keep if AuthProvider doesn't redirect automatically
      
    } catch (error: any) {
      // Display API or other errors not caught by Zod
      setFormError(error.message || 'An unexpected error occurred during sign up.');
      toast.error(error.message || 'Failed to sign up');
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
            {/* Use the Form component from shadcn/ui */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                    {formError}
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isTourist"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                       <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I am a tourist visiting Diani Beach
                        </FormLabel>
                        <FormDescription>
                          Select this if you are planning a trip or currently visiting.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
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
            </Form> {/* Add the missing closing tag */}
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
