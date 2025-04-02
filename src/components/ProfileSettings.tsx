
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Define form validation schema
const profileFormSchema = z.object({
  full_name: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  stay_duration: z.number().int().min(1).max(365).nullish(),
  interests: z.array(z.string()).nullable(),
  dietary_preferences: z.array(z.string()).nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Available interests options
const interestOptions = [
  { label: 'Beach Activities', value: 'beach' },
  { label: 'Water Sports', value: 'water-sports' },
  { label: 'Hiking', value: 'hiking' },
  { label: 'Local Cuisine', value: 'food' },
  { label: 'Cultural Experiences', value: 'culture' },
  { label: 'Nightlife', value: 'nightlife' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Wildlife', value: 'wildlife' },
  { label: 'Photography', value: 'photography' },
  { label: 'Relaxation', value: 'relaxation' },
];

// Available dietary preferences options
const dietaryOptions = [
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Gluten-Free', value: 'gluten-free' },
  { label: 'Lactose-Free', value: 'lactose-free' },
  { label: 'Kosher', value: 'kosher' },
  { label: 'Halal', value: 'halal' },
  { label: 'Pescatarian', value: 'pescatarian' },
  { label: 'No Restrictions', value: 'none' },
];

const ProfileSettings = () => {
  const { profile, updateProfile, signOut } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Set up form with default values from profile
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      stay_duration: profile?.stay_duration || null,
      interests: profile?.interests || [],
      dietary_preferences: profile?.dietary_preferences || [],
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!profile?.id) {
      toast.error('User profile not found');
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile({
        id: profile.id,
        ...data,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    // This would typically involve additional API calls to delete the account
    // For now, we'll just sign out the user
    try {
      setIsUpdating(true);
      await signOut();
      toast.success('You have been logged out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stay_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stay Duration (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="How many days are you staying?"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Interests</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={interestOptions}
                      value={field.value?.map(interest => ({
                        label: interestOptions.find(option => option.value === interest)?.label || interest,
                        value: interest
                      })) || []}
                      onChange={(selected) => field.onChange(selected.map(item => item.value))}
                      placeholder="Select your interests"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dietary_preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Preferences</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={dietaryOptions}
                      value={field.value?.map(pref => ({
                        label: dietaryOptions.find(option => option.value === pref)?.label || pref,
                        value: pref
                      })) || []}
                      onChange={(selected) => field.onChange(selected.map(item => item.value))}
                      placeholder="Select your dietary preferences"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" type="button">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} disabled={isUpdating}>
                      {isUpdating ? <LoadingSpinner size="sm" /> : 'Delete Account'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? <LoadingSpinner size="sm" /> : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
