"use client";

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // For description
import { toast } from "sonner";
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client'; // Use client for invoking edge function

// Define the form schema using Zod
const formSchema = z.object({
  userEmail: z.string().email({ message: "Invalid email address." }),
  businessName: z.string().min(2, { message: "Business name must be at least 2 characters." }),
  contactPersonName: z.string().min(2, { message: "Contact name must be at least 2 characters." }),
  contactEmail: z.string().email({ message: "Invalid contact email address." }),
  contactPhone: z.string().min(10, { message: "Phone number seems too short." }), // Basic validation
  businessType: z.string().min(2, { message: "Business type is required." }),
  description: z.string().optional(), // Optional description
  // Add other relevant operator fields as needed based on your schema
});

type AddOperatorFormValues = z.infer<typeof formSchema>;

interface AddOperatorFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// --- Edge Function Invocation ---
// Define the type for the data sent to the Edge Function
interface CreateOperatorPayload extends AddOperatorFormValues {}

// Define the expected response type from the Edge Function (adjust as needed)
interface CreateOperatorResponse {
  success: boolean;
  message: string;
  operatorId?: string;
  userId?: string;
}

const createOperatorWithUser = async (payload: CreateOperatorPayload): Promise<CreateOperatorResponse> => {
  const { data, error } = await supabase.functions.invoke('create-operator-with-user', {
    body: payload,
  });

  if (error) {
    console.error('Edge function invocation error:', error);
    throw new Error(error.message || 'Failed to invoke Edge Function.');
  }

  // Assuming the function returns a JSON response matching CreateOperatorResponse
  const response = data as CreateOperatorResponse; 
  if (!response.success) {
     throw new Error(response.message || 'Edge function reported an error.');
  }

  return response;
};


const AddOperatorForm: React.FC<AddOperatorFormProps> = ({ onSuccess, onCancel }) => {
  const form = useForm<AddOperatorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userEmail: "",
      businessName: "",
      contactPersonName: "",
      contactEmail: "",
      contactPhone: "",
      businessType: "",
      description: "",
    },
  });

  const mutation = useMutation<CreateOperatorResponse, Error, CreateOperatorPayload>({
    mutationFn: createOperatorWithUser,
    onSuccess: (data) => {
      toast.success(data.message || "Operator and user created successfully!");
      form.reset(); // Reset form fields
      onSuccess(); // Call the success callback (e.g., close sheet)
    },
    onError: (error) => {
      toast.error(`Failed to create operator: ${error.message}`);
    },
  });

  function onSubmit(values: AddOperatorFormValues) {
    console.log("Submitting form values:", values);
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        {/* User Email */}
        <FormField
          control={form.control}
          name="userEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Account Email *</FormLabel>
              <FormControl>
                <Input placeholder="operator@example.com" {...field} disabled={mutation.isPending} />
              </FormControl>
              <FormDescription>
                The email address for the operator's login account. An invitation will be sent here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Business Name */}
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name *</FormLabel>
              <FormControl>
                <Input placeholder="Diani Beach Safaris" {...field} disabled={mutation.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Person Name */}
        <FormField
          control={form.control}
          name="contactPersonName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person Name *</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} disabled={mutation.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Email */}
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email (Public) *</FormLabel>
              <FormControl>
                <Input placeholder="info@dianibeachsafaris.com" {...field} disabled={mutation.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Phone */}
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone *</FormLabel>
              <FormControl>
                <Input placeholder="+254 7XX XXX XXX" {...field} disabled={mutation.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Business Type */}
        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type *</FormLabel>
              <FormControl>
                {/* Consider using a Select if you have predefined types */}
                <Input placeholder="e.g., Tour Operator, Hotel, Restaurant" {...field} disabled={mutation.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description (Optional) */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Briefly describe the business..."
                  className="resize-none"
                  {...field}
                  disabled={mutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
           <Button type="button" variant="outline" onClick={onCancel} disabled={mutation.isPending}>
             Cancel
           </Button>
           <Button type="submit" disabled={mutation.isPending}>
             {mutation.isPending ? 'Creating...' : 'Create Operator'}
           </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddOperatorForm;
