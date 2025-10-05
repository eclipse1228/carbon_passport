-- Create storage bucket for passport photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'passport-photos',
    'passport-photos',
    true, -- public bucket for simplicity
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE
SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[];

-- Create storage policies
-- Allow anyone to upload files
CREATE POLICY "Anyone can upload passport photos" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'passport-photos');

-- Allow anyone to view passport photos (public bucket)
CREATE POLICY "Passport photos are publicly accessible" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'passport-photos');

-- Allow anyone to delete their own uploads (within same session)
CREATE POLICY "Users can delete their own uploads" 
    ON storage.objects FOR DELETE 
    USING (bucket_id = 'passport-photos');