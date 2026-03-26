export type UserRole = "startup" | "corporate" | "investor" | "admin";
export type StartupStage = "pre_seed" | "seed" | "series_a" | "series_b" | "series_c_plus";
export type WishlistStatus = "open" | "closed" | "reviewing";
export type EventType = "summit" | "workshop" | "pitstop" | "webinar";
export type MatchStatus = "pending" | "accepted" | "rejected" | "connected";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Startup {
  id: string;
  profile_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  sector: string;
  stage: StartupStage;
  description_tr: string;
  description_en: string;
  founded_year: number;
  team_size: number;
  funding: string | null;
  location: string;
  website: string | null;
  tags: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Corporate {
  id: string;
  profile_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  sector: string;
  description_tr: string;
  description_en: string;
  location: string;
  website: string | null;
  is_founder: boolean;
  member_since: number;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  corporate_id: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  sector: string;
  tags: string[];
  deadline: string | null;
  status: WishlistStatus;
  created_at: string;
  updated_at: string;
  // Joined fields
  corporate?: Corporate;
  _count?: { applications: number };
}

export interface WishlistApplication {
  id: string;
  wishlist_item_id: string;
  startup_id: string;
  message: string | null;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export interface Event {
  id: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  max_attendees: number;
  image_url: string | null;
  created_at: string;
  // Computed
  attendee_count?: number;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  profile_id: string;
  created_at: string;
}

export interface NewsArticle {
  id: string;
  title_tr: string;
  title_en: string;
  summary_tr: string;
  summary_en: string;
  content_tr: string;
  content_en: string;
  slug: string;
  category: string;
  image_url: string | null;
  author: string;
  published_at: string;
  created_at: string;
}

export interface MatchResult {
  id: string;
  startup_id: string;
  corporate_id: string;
  score: number;
  reasons_tr: string[];
  reasons_en: string[];
  status: MatchStatus;
  created_at: string;
  // Joined
  startup?: Startup;
  corporate?: Corporate;
}
