
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/integrations/supabase/client"; // Import Supabase client
import { PointOfInterest } from "@/types/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

/**
 * Function to get all Points of Interest
 */
export async function getAllPOIs(category?: string): Promise<PointOfInterest[] | null> {
  let query = (supabase
    .from('points_of_interest')
    .select('*') as any);
  
  if (category) {
    query = query.eq('category', category);
  }
  
  return await safeQueryFunction(() => query.order('name')) as Promise<PointOfInterest[] | null>;
}

/**
 * Function to get a single Point of Interest by ID
 */
export async function getPOIById(id: string): Promise<PointOfInterest | null> {
  return await safeQueryFunction(() => 
    (supabase
      .from('points_of_interest')
      .select('*')
      .eq('id', id)
      .single() as any)
  ) as Promise<PointOfInterest | null>;
}

/**
 * Function to get Points of Interest near a location
 */
export async function getPOIsNearLocation(latitude: number, longitude: number, radiusKm: number = 5): Promise<PointOfInterest[] | null> {
  // This is a simplistic approach to finding nearby POIs
  // A more accurate approach would use PostGIS if available
  const latDegreeDistance = radiusKm / 111; // Approx. 111km per latitude degree
  const lngDegreeDistance = radiusKm / (111 * Math.cos(latitude * Math.PI / 180)); // Adjust for longitude
  
  return await safeQueryFunction(() => 
    (supabase
      .from('points_of_interest')
      .select('*')
      .gte('latitude', latitude - latDegreeDistance)
      .lte('latitude', latitude + latDegreeDistance)
      .gte('longitude', longitude - lngDegreeDistance)
      .lte('longitude', longitude + lngDegreeDistance) as any)
  ) as Promise<PointOfInterest[] | null>;
}

/**
 * Helper function for Supabase operations that handles errors consistently
 */
export async function safeQueryFunction<T>(
  operation: () => Promise<{ data: T | null; error: any | null }>
): Promise<T | null> {
  try {
    const { data, error } = await operation();
    
    if (error) {
      console.error('Supabase operation error:', error);
      return null;
    }
    
    return data;
  } catch (error: any) {
    console.error('Unexpected error in Supabase operation:', error);
    return null;
  }
}

/**
 * Function to check if a user has an operator profile
 */
export async function checkUserHasOperator(userId: string): Promise<boolean> {
  const data = await safeQueryFunction(() => 
    supabase
      .from('operators')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle() as any
  );
  
  return !!data;
}

/**
 * Function to get a user's profile
 */
export async function getUserProfile(userId: string) {
  return await safeQueryFunction(() => 
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single() as any
  );
}

/**
 * Function to update a user's profile
 */
export async function updateUserProfile(userId: string, profileData: any) {
  return await safeQueryFunction(() => 
    supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId) as any
  );
}
