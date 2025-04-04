
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/integrations/supabase/client";
import { PointOfInterest, UserProfile } from "@/types/database";

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
    .from('points_of_interest')
    .select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query.order('name');
  
  if (error) {
    console.error('Supabase operation error:', error);
    return null;
  }
  
  return data as PointOfInterest[];
}

/**
 * Function to get a single Point of Interest by ID
 */
export async function getPOIById(id: string): Promise<PointOfInterest | null> {
  const { data, error } = await supabase
    .from('points_of_interest')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Supabase operation error:', error);
    return null;
  }
  
  return data as PointOfInterest;
}

/**
 * Function to get Points of Interest near a location
 */
export async function getPOIsNearLocation(
  latitude: number, 
  longitude: number, 
  radiusKm: number = 5
): Promise<PointOfInterest[] | null> {
  // This is a simplistic approach to finding nearby POIs
  const latDegreeDistance = radiusKm / 111;
  const lngDegreeDistance = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));
  
  const { data, error } = await supabase
    .from('points_of_interest')
    .select('*')
    .gte('latitude', latitude - latDegreeDistance)
    .lte('latitude', latitude + latDegreeDistance)
    .gte('longitude', longitude - lngDegreeDistance)
    .lte('longitude', longitude + lngDegreeDistance);

  if (error) {
    console.error('Supabase operation error:', error);
    return null;
  }
  
  return data as PointOfInterest[];
}

/**
 * Function to check if a user has an operator profile
 */
export async function checkUserHasOperator(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('operators')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) {
    console.error('Supabase operation error:', error);
    return false;
  }
  
  return !!data;
}

/**
 * Function to get a user's profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Supabase operation error:', error);
    return null;
  }
  
  return data as UserProfile;
}

/**
 * Function to update a user's profile
 */
export async function updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<any> {
  // Ensure id is included
  const dataWithId = { ...profileData, id: userId };
  
  const { data, error } = await supabase
    .from('profiles')
    .update(dataWithId)
    .eq('id', userId);

  if (error) {
    console.error('Supabase operation error:', error);
    return null;
  }
  
  return data;
}
