CREATE TABLE public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null default '',
  cover_image text,
  tags text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admins manage posts" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.blog_posts (slug,title,excerpt,content,tags) VALUES
('building-whatsapp-bots-that-scale','Building WhatsApp bots that actually scale','How CAT CPN keeps automation bots online 24/7 with low data usage and resilient reconnect logic.','Running a WhatsApp bot for thousands of users is less about clever commands and more about staying connected.
We design every CAT CPN bot around three rules: reconnect fast, cache aggressively, and never trust the network.
Session storage is persisted so a restart does not force a re-scan, and every command is rate limited per user.
Health checks ping the bot every minute; if it stops responding the process is restarted automatically.
The result is a bot that survives bad connectivity days without any manual babysitting.',ARRAY['bots','whatsapp','automation']),
('web-tools-for-african-connectivity','Designing web tools for African connectivity','Light pages, offline support and low-data assets — practical performance lessons from Uganda.','Most templates assume fast fibre. Ours assume a shared 3G connection on a mid-range Android phone.
That means lazy loading every image, shipping route-level code splits, and keeping the first paint under a second.
The PWA layer caches the shell so returning visitors get an instant load even offline.
Fonts are subset, animation is GPU-friendly, and nothing blocks rendering.
Performance here is not a vanity metric — it decides whether people can use the tool at all.',ARRAY['performance','pwa','design']),
('inside-the-cat-cpn-stack','Inside the CAT CPN stack','React, TypeScript, Tailwind, Framer Motion and a managed Postgres backend — why this combination wins.','The stack is deliberately boring where it matters and modern where it pays off.
React with TypeScript keeps refactors safe, Tailwind keeps the design system in one place, and Framer Motion adds polish without heavy libraries.
The backend handles auth, row-level security, storage and realtime, so the whole site can be maintained by one person.
Admin content lives in the database, meaning copy and projects can change without a deploy.
Simple architecture, fast iteration, no surprises at 2am.',ARRAY['stack','react','engineering']);