ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text, ADD COLUMN IF NOT EXISTS phone text, ADD COLUMN IF NOT EXISTS date_of_birth date;
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, bio, phone, date_of_birth, avatar_url)
  VALUES (NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', NEW.email),
    NULLIF(left(NEW.raw_user_meta_data->>'bio', 500), ''),
    NULLIF(left(NEW.raw_user_meta_data->>'phone', 30), ''),
    CASE WHEN COALESCE(NEW.raw_user_meta_data->>'date_of_birth','') ~ '^\d{4}-\d{2}-\d{2}$' THEN (NEW.raw_user_meta_data->>'date_of_birth')::date ELSE NULL END,
    NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END; $$;