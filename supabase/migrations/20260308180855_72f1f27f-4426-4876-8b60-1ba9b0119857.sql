
-- Create a public storage bucket for site images
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

-- Allow admins to upload files
CREATE POLICY "Admins can upload site images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow admins to update files
CREATE POLICY "Admins can update site images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow admins to delete files
CREATE POLICY "Admins can delete site images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow anyone to read site images (public bucket)
CREATE POLICY "Anyone can view site images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');
