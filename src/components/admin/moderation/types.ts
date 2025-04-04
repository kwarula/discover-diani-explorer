
// Defines the structure for Flagged Content data used in the admin dashboard

export type FlaggedContent = {
  id: string; // Unique ID for the flagged item report
  content_id: string; // ID of the actual content (e.g., review_id, comment_id, listing_id)
  content_type: 'Review' | 'Comment' | 'Listing' | 'OperatorProfile' | string; // Type of content flagged
  content_snippet: string | null; // A short snippet of the flagged content
  reason: string | null; // Reason provided by the reporter
  reported_by_user_id: string | null; // ID of the user who reported
  reported_by_email: string | null; // Email of the user who reported (for display)
  status: 'Pending' | 'Resolved' | 'Dismissed' | string; // Moderation status
  reported_at: string; // Timestamp string
  resolved_at: string | null;
  resolved_by_user_id: string | null;
  moderator_notes: string | null;
};
