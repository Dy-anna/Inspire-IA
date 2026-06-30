
-- 1) Move whatsapp_access_token to company_secrets, then drop from companies
INSERT INTO public.company_secrets (company_id, whatsapp_access_token)
SELECT c.id, c.whatsapp_access_token
FROM public.companies c
WHERE c.whatsapp_access_token IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.company_secrets s WHERE s.company_id = c.id);

UPDATE public.company_secrets s
SET whatsapp_access_token = c.whatsapp_access_token,
    updated_at = NOW()
FROM public.companies c
WHERE s.company_id = c.id
  AND c.whatsapp_access_token IS NOT NULL
  AND (s.whatsapp_access_token IS NULL OR s.whatsapp_access_token = '');

ALTER TABLE public.companies DROP COLUMN IF EXISTS whatsapp_access_token;

-- 2) Remove overly permissive storage policies
DROP POLICY IF EXISTS "avatars_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "avatars_auth_update" ON storage.objects;

DROP POLICY IF EXISTS "company_logos_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "company_logos_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "company_logos_auth_delete" ON storage.objects;

DROP POLICY IF EXISTS "menu_items_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "menu_items_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "menu_items_auth_delete" ON storage.objects;

DROP POLICY IF EXISTS "properties_auth_insert" ON storage.objects;

DROP POLICY IF EXISTS "trip_packages_auth_insert" ON storage.objects;

-- 3) Restrict sensitive chatbots columns via column-level grants
REVOKE SELECT (whatsapp_verify_token, whatsapp_phone_id) ON public.chatbots FROM authenticated;
REVOKE SELECT (whatsapp_verify_token, whatsapp_phone_id) ON public.chatbots FROM anon;
