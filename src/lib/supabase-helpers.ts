
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/integrations/supabase/client";
import { PointOfInterest } from "@/types/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Uploads a file to a specified Supabase Storage bucket.
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
        cacheControl: '3600',
        upsert: true,
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
    throw error;
  }
}

/**
 * Function to get all Points of Interest
 */
export async function getAllPOIs(category?: string): Promise<PointOfInterest[] | null> {
  let query = supabase
    .from('points_of_interest' as any)
    .select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const result = await safeQueryFunction(() => query.order('name'));
  return result as PointOfInterest[] | null;
}

/**
 * Function to get a single Point of Interest by ID
 */
export async function getPOIById(id: string): Promise<PointOfInterest | null> {
  const result = await safeQueryFunction(() => 
    supabase
      .from('points_of_interest' as any)
      .select('*')
      .eq('id', id)
      .single()
  );
  return result as PointOfInterest | null;
}

/**
 * Function to get Points of Interest near a location
 */
export async function getPOIsNearLocation(latitude: number, longitude: number, radiusKm: number = 5): Promise<PointOfInterest[] | null> {
  // This is a simplistic approach to finding nearby POIs
  const latDegreeDistance = radiusKm / 111; // Approx. 111km per latitude degree
  const lngDegreeDistance = radiusKm / (111 * Math.cos(latitude * Math.PI / 180)); // Adjust for longitude
  
  const result = await safeQueryFunction(() => 
    supabase
      .from('points_of_interest' as any)
      .select('*')
      .gte('latitude', latitude - latDegreeDistance)
      .lte('latitude', latitude + latDegreeDistance)
      .gte('longitude', longitude - lngDegreeDistance)
      .lte('longitude', longitude + lngDegreeDistance)
  );
  
  return result as PointOfInterest[] | null;
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
      .from('operators' as any)
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()
  );
  
  return !!data;
}

/**
 * Function to get a user's profile
 */
export async function getUserProfile(userId: string) {
  return await safeQueryFunction(() => 
    supabase
      .from('profiles' as any)
      .select('*')
      .eq('id', userId)
      .single()
  );
}

/**
 * Function to update a user's profile
 */
export async function updateUserProfile(userId: string, profileData: any) {
  return await safeQueryFunction(() => 
    supabase
      .from('profiles' as any)
      .update(profileData)
      .eq('id', userId)
  );
}
