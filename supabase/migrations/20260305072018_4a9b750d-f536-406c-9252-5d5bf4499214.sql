
-- Site content table for editable website sections
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Everyone can read site content
CREATE POLICY "Anyone can read site content" ON public.site_content
  FOR SELECT USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage site content" ON public.site_content
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Analytics: page views
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL DEFAULT '/',
  visitor_id text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views (anonymous tracking)
CREATE POLICY "Anyone can insert page views" ON public.page_views
  FOR INSERT WITH CHECK (true);

-- Only admins can read page views
CREATE POLICY "Admins can read page views" ON public.page_views
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Analytics: signup tracking (daily aggregates)
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can insert events" ON public.analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read events" ON public.analytics_events
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for page_views and analytics_events
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics_events;

-- Seed default site content
INSERT INTO public.site_content (section_key, content) VALUES
('hero', '{"title": "Creative Productivity", "subtitle": "Nexus CPN", "description": "Building powerful digital tools and solutions for everyone", "badge": "◆ Welcome ◆", "cta_text": "Explore Tools", "version": "v2.0.25"}'),
('stats', '{"title": "CAT-CPN-GO", "subtitle": "Real-time statistics from our main repository", "github_url": "https://github.com/Ph462/cpn-creative-hub", "items": [{"label": "Stars", "value": "418"}, {"label": "Forks", "value": "1,551"}, {"label": "Watchers", "value": "418"}, {"label": "Issues", "value": "44"}]}'),
('projects', '{"title": "What We Create", "subtitle": "Check out everything we''ve made! Free websites, tools, and projects - all ready for you to use.", "items": [{"title": "CAT BOT", "description": "Use well", "status": "Active", "category": "Bots", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5c6gqPClWYRnJS4eSC5nZ-sopLubM_CuQxjtfP5pOuA&s=10", "link": "https://ph462.github.io/CAT-BOT/"}]}'),
('testimonials', '{"title": "What People Say", "subtitle": "Feedback from our community and users", "items": [{"text": "Nice job", "author": "popkid", "date": "Jan 2026"}, {"text": "Amazing tools, very helpful for my projects!", "author": "techuser", "date": "Dec 2025"}, {"text": "The best WhatsApp bot I''ve ever used", "author": "Cat Phoenix", "date": "Nov 2025"}]}'),
('founder', '{"name": "Oundo Nelson", "role": "Founder & Developer", "bio": "Passionate about creating innovative digital solutions that make a difference.", "location": "Uganda, East Africa", "tagline": "Creator & Problem Solver", "skills": [{"name": "Web Development", "percent": 99}, {"name": "Bot Development", "percent": 92}, {"name": "UI/UX Design", "percent": 88}]}'),
('connect', '{"title": "Connect With Us", "subtitle": "Follow us on social media for updates, tutorials, and new releases", "whatsapp_channel": "https://whatsapp.com/channel/0029Vb7ARUq1iUxhqTjpPz0n", "socials": [{"label": "YouTube", "href": "https://www.youtube.com/@CatPhoenix"}, {"label": "Instagram", "href": "https://www.instagram.com/catphoenix3"}, {"label": "WhatsApp", "href": "https://wa.me/256750713834"}]}');

-- Trigger to track signups
CREATE OR REPLACE FUNCTION public.track_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.analytics_events (event_type, event_data)
  VALUES ('signup', jsonb_build_object('user_id', NEW.id, 'email', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_analytics
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.track_signup();
