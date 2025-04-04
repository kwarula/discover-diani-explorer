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
  // Validate input parameters
  if (!file) throw new Error("No file provided");
  if (!bucketName) throw new Error("No bucket name provided");
  if (!filePath) throw new Error("No file path provided");
  
  console.log(`Attempting to upload file "${file.name}" (${file.size} bytes) to ${bucketName}/${filePath}`);
  
  try {
    // Check file size (10MB limit for most Supabase plans)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum allowed size (10MB). File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }
    
    // Check if bucket exists by listing buckets
    try {
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.error("Error checking buckets:", bucketError);
        throw new Error(`Failed to access storage: ${bucketError.message}`);
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      if (!bucketExists) {
        console.error(`Bucket '${bucketName}' does not exist`);
        throw new Error(`Storage bucket '${bucketName}' not found. Please contact support.`);
      }
    } catch (bucketCheckError: any) {
      console.error("Error during bucket check:", bucketCheckError);
      // Continue anyway - bucket might exist but user might not have list permissions
    }

    // Attempt to upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600', // 1 hour cache
        upsert: true, // Overwrite file if it exists
      });

    if (uploadError) {
      // Handle specific error types
      if (uploadError.message.includes("duplicate")) {
        console.warn(`File at path ${filePath} already exists, attempting to overwrite`);
        // Try to get URL anyway - the file might exist and that's ok with upsert
      } else if (uploadError.message.includes("permission")) {
        console.error(`Permission denied uploading to ${bucketName}/${filePath}:`, uploadError);
        throw new Error(`Permission denied: You don't have access to upload to this location.`);
      } else if (uploadError.message.includes("auth")) {
        console.error(`Authentication error uploading to ${bucketName}/${filePath}:`, uploadError);
        throw new Error(`Authentication error: Please log out and log back in.`);
      } else {
        console.error(`Supabase upload error (${bucketName}/${filePath}):`, uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (!urlData || !urlData.publicUrl) {
      console.error(`Failed to get public URL for ${bucketName}/${filePath}`);
      throw new Error("Failed to get public URL for the uploaded file.");
    }

    console.log(`File uploaded successfully to ${bucketName}/${filePath}`);
    console.log(`Public URL: ${urlData.publicUrl}`);
    return urlData.publicUrl;

  } catch (error: any) {
    // Add more context to the error
    const enhancedError = new Error(
      `Error uploading file ${file.name} to ${bucketName}/${filePath}: ${error.message || 'Unknown error'}`
    );
    console.error(enhancedError);
    
    // Log additional debugging info
    console.error("Upload error details:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      bucket: bucketName,
      path: filePath,
      error: error.message || 'Unknown error'
    });
    
    // Re-throw with more context
    throw enhancedError;
  }
}
