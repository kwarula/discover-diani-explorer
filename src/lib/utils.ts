
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/integrations/supabase/client"; // Import Supabase client
import { format } from 'date-fns'; // Import format from date-fns

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string into a readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if formatting fails
  }
}

/**
 * Uploads a file to a specified Supabase Storage bucket.
 * @param file The file object to upload.
 * @param bucketName The name of the Supabase Storage bucket.
 * @param filePath The desired path/name for the file within the bucket (should be unique).
 * @returns The public URL of the uploaded file.
 * @throws If the upload or URL retrieval fails.
 */
export async function uploadFileToSupabase(
  file: File,
  bucketName: string,
  filePath: string
): Promise<string> {
  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600', // Optional: Cache control header
        upsert: true, // Optional: Overwrite file if it exists
      });

    if (uploadError) {
      console.error(`Supabase upload error (${bucketName}/${filePath}):`, uploadError);
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (!urlData || !urlData.publicUrl) {
       console.error(`Supabase getPublicUrl error (${bucketName}/${filePath}): URL data missing`);
      throw new Error("Failed to get public URL for the uploaded file.");
    }

    console.log(`File uploaded successfully to ${bucketName}/${filePath}: ${urlData.publicUrl}`);
    return urlData.publicUrl;

  } catch (error) {
    console.error("Unexpected error during file upload:", error);
    // Re-throw the error to be caught by the calling function
    throw error;
  }
}
