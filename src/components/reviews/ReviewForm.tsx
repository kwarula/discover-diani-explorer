import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utility for class names exists

// Zod schema for validation
const reviewFormSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5),
  comment: z.string().max(1000, 'Comment must be 1000 characters or less').optional(),
  used_guide: z.boolean().optional(),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>; // Export the type

interface ReviewFormProps {
  listingId?: string; // Pass either listingId or operatorId
  operatorId?: string;
  userId: string; // ID of the user submitting the review
  onSubmit: (values: ReviewFormValues & { listingId?: string; operatorId?: string; userId: string }) => Promise<void>; // Function to handle submission
  isSubmitting: boolean; // To disable button during submission
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  listingId,
  operatorId,
  userId,
  onSubmit,
  isSubmitting,
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: '',
      used_guide: false,
    },
  });

  const handleFormSubmit = async (data: ReviewFormValues) => {
    await onSubmit({ ...data, listingId, operatorId, userId });
    // Optionally reset form after successful submission
    // form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Rating Field using Stars */}
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Rating *</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        'h-6 w-6 cursor-pointer transition-colors',
                        (hoverRating || field.value) >= star
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      )}
                      onClick={() => field.onChange(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Comment Field */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tell others about your experience (optional, max 1000 characters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Used Guide Checkbox */}
        <FormField
          control={form.control}
          name="used_guide"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Did you use a guide for this experience?
                </FormLabel>
                <FormDescription>
                  (This helps others know if a guide is recommended).
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Form>
  );
};

export default ReviewForm;
