
/**
 * Types for the content moderation system
 */

// Possible status values for moderated content
export type ModerationStatus = "Pending" | "Resolved" | "Dismissed";

// Types of content that can be flagged
export type ContentType = "Review" | "Comment" | "Listing" | "OperatorProfile";

// Structure of a flagged content item
export interface FlaggedContent {
  id: string;
  content_id: string;
  content_type: ContentType;
  content_snippet: string;
  reported_by_user_id: string;
  reported_by_email?: string;
  reason: string;
  status: ModerationStatus;
  reported_at: string;
  resolved_by_user_id: string | null;
  resolved_at: string | null;
  moderator_notes: string | null;
}

// Utility types for admin operations
export interface ModerateContentParams {
  id: string;
  status: ModerationStatus;
  notes?: string;
}
