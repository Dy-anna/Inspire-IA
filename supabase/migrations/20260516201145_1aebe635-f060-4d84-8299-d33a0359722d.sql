
-- 1. Drop overly permissive UPDATE policy on leads (USING true / WITH CHECK true)
DROP POLICY IF EXISTS leads_service_update ON public.leads;

-- 2. Drop self-registration policy that lets new users create an 'active' company,
-- bypassing the pending/inactive approval flow already enforced by
-- authenticated_users_can_register_company.
DROP POLICY IF EXISTS self_registration_create_company ON public.companies;

-- 3. Restrict ai_chatbox_prompts read access to authenticated users
DROP POLICY IF EXISTS prompts_public_read ON public.ai_chatbox_prompts;
CREATE POLICY prompts_authenticated_read ON public.ai_chatbox_prompts
  FOR SELECT TO authenticated USING (true);

-- 4. Hide WhatsApp access token from client roles via column-level revoke.
-- Server-side code uses the service-role admin client which bypasses these grants.
REVOKE SELECT (whatsapp_access_token) ON public.companies FROM anon, authenticated;

-- 5. Recreate v_chatbot_whatsapp without the secret token and with security_invoker
DROP VIEW IF EXISTS public.v_chatbot_whatsapp;
CREATE VIEW public.v_chatbot_whatsapp
WITH (security_invoker = on) AS
SELECT cb.id AS chatbot_id,
       cb.company_id,
       cb.name AS chatbot_name,
       cb.welcome_message,
       cb.escalation_phone,
       cb.sector_template,
       cb.settings,
       c.name AS company_name,
       c.sector,
       c.whatsapp_phone_number_id,
       c.whatsapp_business_id
FROM public.chatbots cb
JOIN public.companies c ON c.id = cb.company_id
WHERE cb.is_active = true
  AND c.whatsapp_phone_number_id IS NOT NULL;

-- 6. Set immutable search_path on SECURITY DEFINER functions that lack it
ALTER FUNCTION public.enforce_company_status_on_insert() SET search_path = public;
ALTER FUNCTION public.notify_make_s1_lead() SET search_path = public;
ALTER FUNCTION public.notify_make_s2_activation() SET search_path = public;
ALTER FUNCTION public.notify_make_s4_booking() SET search_path = public;
ALTER FUNCTION public.notify_s10_lead_qualification() SET search_path = public;
ALTER FUNCTION public.notify_s13_smart_onboarding() SET search_path = public;
ALTER FUNCTION public.notify_s15_prospect_research() SET search_path = public;
ALTER FUNCTION public.update_updated_at() SET search_path = public;

-- 7. Lock down SECURITY DEFINER RPCs so anon cannot invoke them.
-- These are intended to be called from trusted server code or by admin users only.
REVOKE EXECUTE ON FUNCTION public.activate_company(uuid, uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.deactivate_company(uuid, uuid, company_status, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.link_demo_restaurant_user(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_chatbot_crm_write(uuid, uuid, uuid, sector_type, text, jsonb, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_chatbot_crm_write_flat(text, text, text, text, text, text, text, text, text, numeric, text, text, text, text, numeric, numeric, text, text, integer, text, integer, text, text, text, text, text, text, text, text, text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_chatbox_ai_context(text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_company_whatsapp_config(text) FROM PUBLIC, anon, authenticated;

-- 8. Move pg_trgm extension out of the public schema
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO anon, authenticated, service_role;
ALTER EXTENSION pg_trgm SET SCHEMA extensions;
