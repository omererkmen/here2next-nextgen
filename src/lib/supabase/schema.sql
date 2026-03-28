-- Here2Next NextGen Platform Database Schema
-- Run this in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'startup' CHECK (role IN ('startup', 'corporate', 'investor', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'startup')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- STARTUPS
-- ============================================
CREATE TABLE startups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  sector TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('pre_seed', 'seed', 'series_a', 'series_b', 'series_c_plus')),
  description_tr TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  founded_year INTEGER,
  team_size INTEGER DEFAULT 1,
  funding TEXT,
  location TEXT NOT NULL DEFAULT 'İstanbul',
  website TEXT,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_startups_sector ON startups(sector);
CREATE INDEX idx_startups_stage ON startups(stage);
CREATE INDEX idx_startups_featured ON startups(featured);

-- ============================================
-- CORPORATES
-- ============================================
CREATE TABLE corporates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  sector TEXT NOT NULL,
  description_tr TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT 'İstanbul',
  website TEXT,
  is_founder BOOLEAN DEFAULT FALSE,
  member_since INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_corporates_sector ON corporates(sector);

-- ============================================
-- WISHLIST ITEMS
-- ============================================
CREATE TABLE wishlist_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  corporate_id UUID REFERENCES corporates(id) ON DELETE CASCADE NOT NULL,
  title_tr TEXT NOT NULL,
  title_en TEXT NOT NULL DEFAULT '',
  description_tr TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  sector TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'reviewing')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wishlist_status ON wishlist_items(status);
CREATE INDEX idx_wishlist_corporate ON wishlist_items(corporate_id);

-- ============================================
-- WISHLIST APPLICATIONS
-- ============================================
CREATE TABLE wishlist_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wishlist_item_id UUID REFERENCES wishlist_items(id) ON DELETE CASCADE NOT NULL,
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wishlist_item_id, startup_id)
);

-- ============================================
-- EVENTS
-- ============================================
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_tr TEXT NOT NULL,
  title_en TEXT NOT NULL DEFAULT '',
  description_tr TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL,
  time TEXT NOT NULL DEFAULT '09:00-18:00',
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('summit', 'workshop', 'pitstop', 'webinar')),
  max_attendees INTEGER DEFAULT 100,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_date ON events(date);

-- ============================================
-- EVENT REGISTRATIONS
-- ============================================
CREATE TABLE event_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, profile_id)
);

-- ============================================
-- NEWS ARTICLES
-- ============================================
CREATE TABLE news_articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_tr TEXT NOT NULL,
  title_en TEXT NOT NULL DEFAULT '',
  summary_tr TEXT NOT NULL DEFAULT '',
  summary_en TEXT NOT NULL DEFAULT '',
  content_tr TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'Genel',
  image_url TEXT,
  author TEXT NOT NULL DEFAULT 'Here2Next',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MATCH RESULTS
-- ============================================
CREATE TABLE match_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE NOT NULL,
  corporate_id UUID REFERENCES corporates(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  reasons_tr TEXT[] DEFAULT '{}',
  reasons_en TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'connected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(startup_id, corporate_id)
);

CREATE INDEX idx_matches_score ON match_results(score DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporates ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;

-- Public read access for most tables
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public read startups" ON startups FOR SELECT USING (true);
CREATE POLICY "Owner manages startup" ON startups FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Public read corporates" ON corporates FOR SELECT USING (true);
CREATE POLICY "Owner manages corporate" ON corporates FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Public read wishlist" ON wishlist_items FOR SELECT USING (true);
CREATE POLICY "Corporate manages wishlist" ON wishlist_items FOR ALL
  USING (EXISTS (SELECT 1 FROM corporates WHERE id = corporate_id AND profile_id = auth.uid()));

CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Admin manages events" ON events FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public read news" ON news_articles FOR SELECT USING (true);
CREATE POLICY "Admin manages news" ON news_articles FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public read matches" ON match_results FOR SELECT USING (true);

CREATE POLICY "Startup applies to wishlist" ON wishlist_applications FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM startups WHERE id = startup_id AND profile_id = auth.uid()));
CREATE POLICY "Read own applications" ON wishlist_applications FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM startups WHERE id = startup_id AND profile_id = auth.uid())
    OR EXISTS (SELECT 1 FROM corporates c JOIN wishlist_items w ON w.corporate_id = c.id WHERE w.id = wishlist_item_id AND c.profile_id = auth.uid())
  );

CREATE POLICY "User registers for events" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Read own registrations" ON event_registrations FOR SELECT USING (auth.uid() = profile_id);

-- ============================================
-- VIEWS (for convenience)
-- ============================================
CREATE OR REPLACE VIEW wishlist_with_counts AS
SELECT
  w.*,
  c.name AS corporate_name,
  c.logo_url AS corporate_logo,
  COUNT(wa.id) AS application_count
FROM wishlist_items w
JOIN corporates c ON c.id = w.corporate_id
LEFT JOIN wishlist_applications wa ON wa.wishlist_item_id = w.id
GROUP BY w.id, c.name, c.logo_url;

CREATE OR REPLACE VIEW events_with_counts AS
SELECT
  e.*,
  COUNT(er.id) AS attendee_count
FROM events e
LEFT JOIN event_registrations er ON er.event_id = e.id
GROUP BY e.id;

CREATE OR REPLACE VIEW matches_full AS
SELECT
  m.*,
  s.name AS startup_name,
  s.sector AS startup_sector,
  s.logo_url AS startup_logo,
  c.name AS corporate_name,
  c.logo_url AS corporate_logo
FROM match_results m
JOIN startups s ON s.id = m.startup_id
JOIN corporates c ON c.id = m.corporate_id;
