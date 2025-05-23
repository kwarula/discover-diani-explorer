import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Import shadcn form components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Define the form schema using Zod
const formSchema = z.object({
  business_name: z.string().min(2, { message: "Business name must be at least 2 characters." }),
  business_type: z.string().min(1, { message: "Please select a business type." }), // Required
  contact_person_name: z.string().min(2, { message: "Contact name must be at least 2 characters." }),
  contact_email: z.string().email({ message: "Please enter a valid email address." }),
  contact_phone: z.string().min(10, { message: "Phone number seems too short." }).optional().or(z.literal('')), // Optional phone
});

type AddOperatorFormValues = z.infer<typeof formSchema>;

interface AddOperatorFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// Actual Supabase function call
const addOperatorMutationFn = async (formData: AddOperatorFormValues) => {
  // Ensure we are sending the correct payload expected by the Edge Function
  const payload = {
    business_name: formData.business_name,
    business_type: formData.business_type,
    contact_person_name: formData.contact_person_name,
    contact_email: formData.contact_email,
    contact_phone: formData.contact_phone || null, // Send null if empty, matching potential DB constraints
  };

  console.log("Invoking create-operator-with-user with payload:", payload);

  const { data, error } = await supabase.functions.invoke('create-operator-with-user', {
    body: payload, // Send the structured payload
  });

  if (error) {
    console.error("Error adding operator via function:", error);
    // Throw the error so react-query's onError can handle it and display a toast
    throw new Error(error.message || 'An unexpected error occurred while creating the operator.');
  }

  console.log("Operator creation function returned:", data);
  // Assuming the function returns { success: true, operatorId: '...' } or similar on success
  // Or throws an error handled above if something went wrong inside the function
  if (!data || (data && data.error)) { // Handle potential errors returned in the data object
      throw new Error(data?.error?.message || 'Operator creation failed in the backend function.');
  }
  return data; // Return the success data
};


const AddOperatorForm: React.FC<AddOperatorFormProps> = ({ onSuccess, onCancel }) => {
  // 1. Define your form.
   const form = useForm<AddOperatorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: "",
      business_type: "",
      contact_person_name: "",
      contact_email: "",
      contact_phone: "",
    },
  });

  // Use form control from the hook
  const { control, handleSubmit, reset } = form;

  const mutation = useMutation({
    mutationFn: addOperatorMutationFn,
    onSuccess: (data) => {
      console.log("Operator creation success data:", data); // Updated log message
      toast.success("Operator added successfully."); // Removed placeholder text
      reset(); // Clear the form
      onSuccess(); // Call the onSuccess callback (e.g., close sheet)
    },
    onError: (error: Error) => {
      toast.error(`Failed to add operator: ${error.message}`);
    },
  });

  // 2. Define a submit handler.
  const onSubmit = (values: AddOperatorFormValues) => {
    mutation.mutate(values);
  };

  // 3. Render the form.
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        {/* Business Name */}
        <FormField
          control={control}
          name="business_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Diani Beach Watersports" {...field} disabled={mutation.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Business Type */}
        <FormField
          control={control}
          name="business_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={mutation.isPending}>
                 <FormControl>
                   <SelectTrigger>
                     <SelectValue placeholder="Select type..." />
                   </SelectTrigger>
                 </FormControl>
                 <SelectContent>
                   <SelectItem value="watersports">Watersports</SelectItem>
                   <SelectItem value="accommodation">Accommodation</SelectItem>
                   <SelectItem value="restaurant">Restaurant</SelectItem>
                   <SelectItem value="tour_guide">Tour Guide</SelectItem>
                   <SelectItem value="transport">Transport</SelectItem>
                   <SelectItem value="other">Other</SelectItem>
                 </SelectContent>
               </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Person Name */}
        <FormField
          control={control}
          name="contact_person_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane Doe" {...field} disabled={mutation.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Email */}
        <FormField
          control={control}
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email (for invitation/login)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., contact@dianiwatersports.com" {...field} disabled={mutation.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Phone */}
        <FormField
          control={control}
          name="contact_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="e.g., +254 7..." {...field} disabled={mutation.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <LoadingSpinner className="mr-2" size="sm" /> : null}
            {mutation.isPending ? 'Adding...' : 'Add Operator'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddOperatorForm;
