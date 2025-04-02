import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '@/contexts/auth'; // Assuming useAuth provides signIn and loading state
import { toast } from "@/components/ui/use-toast"; // Or sonner, adjust as needed

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const OperatorLoginForm: React.FC = () => {
  const { signIn, isSigningIn } = useAuth(); // Get signIn method and loading state

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { error } = await signIn(values.email, values.password);
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
      // On successful login, the AuthProvider/OperatorAuth page useEffect should handle redirection
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred during login.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
               {/* Add Forgot Password link here if needed */}
               {/* <div className="text-right mt-1">
                 <Button variant="link" type="button" className="text-sm h-auto p-0">Forgot Password?</Button>
               </div> */}
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSigningIn}>
          {isSigningIn ? 'Signing In...' : 'Sign In'}
        </Button>
        {/* Add OAuth buttons here if needed */}
        {/* <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full" type="button" onClick={() => signInWithProvider('google')} disabled={isSigningIn}>
          Sign In with Google
        </Button> */}
      </form>
    </Form>
  );
};

export default OperatorLoginForm;
