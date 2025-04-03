// Defines the structure for Listing data used in the admin dashboard

export type Listing = {
  id: string;
  title: string | null;
  operator_name: string | null; // Might need a join or separate fetch
  category: string | null; // e.g., 'Accommodation', 'Activity', 'Restaurant'
  status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'featured' | 'unpublished' | string; // Added unpublished
  submitted_at: string; // Timestamp string (mapped from created_at)
  description: string | null; // Added description
  // Add other fields as needed: images, location, price_range, etc.
};
