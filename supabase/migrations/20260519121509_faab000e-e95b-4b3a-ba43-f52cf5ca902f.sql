-- Recreate company-logos storage policies using SECURITY DEFINER helper
DROP POLICY IF EXISTS "logos_company_upload" ON storage.objects;
DROP POLICY IF EXISTS "logos_company_update" ON storage.objects;
DROP POLICY IF EXISTS "logos_company_delete" ON storage.objects;
DROP POLICY IF EXISTS "logos_company_read" ON storage.objects;

CREATE POLICY "logos_company_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'company-logos');

CREATE POLICY "logos_company_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-logos'
  AND (storage.foldername(name))[1] = public.get_current_company_id()::text
);

CREATE POLICY "logos_company_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'company-logos'
  AND (storage.foldername(name))[1] = public.get_current_company_id()::text
)
WITH CHECK (
  bucket_id = 'company-logos'
  AND (storage.foldername(name))[1] = public.get_current_company_id()::text
);

CREATE POLICY "logos_company_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'company-logos'
  AND (storage.foldername(name))[1] = public.get_current_company_id()::text
);