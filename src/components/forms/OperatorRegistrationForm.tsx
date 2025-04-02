import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '@/contexts/auth'; // Assuming useAuth provides signUp and loading state
import { toast } from "@/components/ui/use-toast"; // Or sonner, adjust as needed

// Add confirm password for validation
const registrationSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password." }),
  // Add other basic fields if needed during initial signup, e.g., full name
  // fullName: z.string().min(2, { message: "Full name is required." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Error applies to confirmPassword field
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const OperatorRegistrationForm: React.FC = () => {
  const { signUp, isSigningUp } = useAuth(); // Get signUp method and loading state

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      // fullName: "",
    },
  });

  const onSubmit = async (values: RegistrationFormValues) => {
    try {
      // Pass necessary user data if your signUp function requires it
      // const userData = { full_name: values.fullName };
      const { error } = await signUp(values.email, values.password, {}); // Pass empty object or actual userData
      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      } else {
         toast({
           title: "Registration Successful",
           description: "Please check your email to verify your account.",
         });
         // On successful signup, Supabase usually handles email verification.
         // The user will need to verify before logging in.
         // The OperatorAuth page useEffect will handle redirection upon successful login after verification.
      }
    } catch (error: any) {
      toast({
        title: "Registration Error",
        description: error.message || "An unexpected error occurred during registration.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Add Full Name field if included in schema */}
        {/* <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} type="email" />
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
                <Input placeholder="••••••••" {...field} type="password" />
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
                <Input placeholder="••••••••" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSigningUp}>
          {isSigningUp ? 'Signing Up...' : 'Sign Up'}
        </Button>
         {/* Add OAuth buttons here if needed */}
         {/* <div className="relative my-4"> ... OAuth separator ... </div>
         <Button variant="outline" className="w-full" type="button" onClick={() => signInWithProvider('google')} disabled={isSigningUp}>
           Sign Up with Google
         </Button> */}
      </form>
    </Form>
  );
};

export default OperatorRegistrationForm;
