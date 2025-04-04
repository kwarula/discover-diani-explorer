
// Helper functions for the moderation panel

/**
 * Format a date string into a human-readable format
 */
export const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try { 
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(new Date(dateString)); 
  } catch (e) { 
    return 'Invalid Date'; 
  }
};

/**
 * Format status text to a human-readable format
 */
export const formatStatusText = (status: string | null): string => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Get URL to view content based on content type
 */
export const getContentUrl = (item: {
  content_id: string;
  content_type: string;
}): string | null => {
  if (!item.content_id) return null;
  
  switch (item.content_type?.toLowerCase()) {
    case 'review':
      return `/explore/listing/some-listing-id#review-${item.content_id}`;
    case 'comment':
      return `/blog/post/some-post-id#comment-${item.content_id}`;
    case 'listing':
      return `/explore/listing/${item.content_id}`;
    default:
      return null;
  }
};
