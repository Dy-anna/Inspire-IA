-- 1. company_secrets table
CREATE TABLE IF NOT EXISTS public.company_secrets (
  company_id uuid PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  whatsapp_access_token text,
  whatsapp_verify_token text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.company_secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_secrets_owner_admin_select"
ON public.company_secrets FOR SELECT
TO authenticated
USING (
  is_admin_user() OR (
    company_id = get_current_company_id()
    AND get_current_user_role() IN ('owner','admin')
  )
);

CREATE POLICY "company_secrets_owner_admin_insert"
ON public.company_secrets FOR INSERT
TO authenticated
WITH CHECK (
  is_admin_user() OR (
    company_id = get_current_company_id()
    AND get_current_user_role() IN ('owner','admin')
  )
);

CREATE POLICY "company_secrets_owner_admin_update"
ON public.company_secrets FOR UPDATE
TO authenticated
USING (
  is_admin_user() OR (
    company_id = get_current_company_id()
    AND get_current_user_role() IN ('owner','admin')
  )
)
WITH CHECK (
  is_admin_user() OR (
    company_id = get_current_company_id()
    AND get_current_user_role() IN ('owner','admin')
  )
);

-- 2. Backfill from existing companies rows
INSERT INTO public.company_secrets (company_id, whatsapp_access_token, whatsapp_verify_token)
SELECT id, whatsapp_access_token, whatsapp_verify_token
FROM public.companies
WHERE whatsapp_access_token IS NOT NULL OR whatsapp_verify_token IS NOT NULL
ON CONFLICT (company_id) DO NOTHING;

-- 3. Drop sensitive columns from companies
ALTER TABLE public.companies DROP COLUMN IF EXISTS whatsapp_access_token;
ALTER TABLE public.companies DROP COLUMN IF EXISTS whatsapp_verify_token;

-- 4. Tighten storage.objects: drop public read on company-logos (logos remain
-- reachable via public bucket direct URLs; this only prevents listing)
DROP POLICY IF EXISTS "logos_company_read" ON storage.objects;

-- 5. Trigger to maintain updated_at on company_secrets
CREATE TRIGGER trg_company_secrets_updated_at
BEFORE UPDATE ON public.company_secrets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 6. Adjust get_company_whatsapp_config and get_chatbox_ai_context to read token from company_secrets
CREATE OR REPLACE FUNCTION public.get_company_whatsapp_config(p_phone_number_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'company_id',            c.id,
    'company_name',          c.name,
    'sector',                c.sector,
    'chatbot_id',            cb.id,
    'chatbot_name',          cb.name,
    'welcome_message',       cb.welcome_message,
    'escalation_phone',      cb.escalation_phone,
    'whatsapp_phone_number_id', c.whatsapp_phone_number_id,
    'whatsapp_access_token', cs.whatsapp_access_token,
    'settings',              cb.settings
  )
  INTO v_result
  FROM companies c
  JOIN chatbots cb ON cb.company_id = c.id AND cb.is_active = true
  LEFT JOIN company_secrets cs ON cs.company_id = c.id
  WHERE c.whatsapp_phone_number_id = p_phone_number_id
    AND c.status = 'active'
  LIMIT 1;

  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_chatbox_ai_context(p_phone_number_id text, p_client_phone text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_company     RECORD;
  v_chatbot     RECORD;
  v_prompt      RECORD;
  v_session     RECORD;
  v_secret_token text;
  v_menu_items  JSONB;
  v_doctors     JSONB;
  v_packages    JSONB;
  v_result      JSONB;
BEGIN
  SELECT c.* INTO v_company
  FROM companies c
  WHERE c.whatsapp_phone_number_id = p_phone_number_id
    AND c.status = 'active'
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN '{"error": "Company not found"}'::jsonb;
  END IF;

  SELECT whatsapp_access_token INTO v_secret_token
  FROM company_secrets WHERE company_id = v_company.id;

  SELECT cb.* INTO v_chatbot
  FROM chatbots cb
  WHERE cb.company_id = v_company.id AND cb.is_active = true
  LIMIT 1;

  SELECT p.* INTO v_prompt
  FROM ai_chatbox_prompts p
  WHERE p.sector = v_company.sector::text
    AND p.is_active = true
  ORDER BY p.version DESC
  LIMIT 1;

  SELECT s.*, ac.messages, ac.extracted_data, ac.current_intent,
         ac.sentiment, ac.conversation_stage, ac.turn_count
  INTO v_session
  FROM chat_sessions s
  LEFT JOIN ai_session_context ac ON ac.session_id = s.id
  WHERE s.company_id = v_company.id
    AND s.client_phone = p_client_phone
    AND s.status = 'active'
  ORDER BY s.created_at DESC
  LIMIT 1;

  IF v_company.sector = 'restaurant' THEN
    SELECT jsonb_agg(jsonb_build_object(
      'name', mi.name, 'category', mi.category,
      'price', mi.price, 'description', mi.description,
      'available', mi.is_available
    )) INTO v_menu_items
    FROM menu_items mi
    WHERE mi.company_id = v_company.id AND mi.is_available = true;
  ELSIF v_company.sector = 'private_clinic' THEN
    SELECT jsonb_agg(jsonb_build_object(
      'id', d.id, 'name', d.first_name || ' ' || d.last_name,
      'specialty', d.specialty,
      'fee', d.consultation_fee
    )) INTO v_doctors
    FROM doctors d
    WHERE d.company_id = v_company.id AND d.is_active = true;
  END IF;

  v_result := jsonb_build_object(
    'company_id', v_company.id,
    'company_name', v_company.name,
    'sector', v_company.sector,
    'whatsapp_access_token', v_secret_token,
    'whatsapp_phone_number_id', v_company.whatsapp_phone_number_id,
    'settings', v_company.settings,
    'chatbot_id', v_chatbot.id,
    'escalation_phone', v_chatbot.escalation_phone,
    'escalation_email', v_chatbot.escalation_email,
    'system_prompt', v_prompt.system_prompt,
    'few_shot_examples', v_prompt.few_shot_examples,
    'ai_config', v_prompt.config,
    'available_actions', v_prompt.available_actions,
    'session_id', v_session.id,
    'conversation_history', COALESCE(v_session.messages, '[]'::jsonb),
    'extracted_data', COALESCE(v_session.extracted_data, '{}'::jsonb),
    'current_intent', v_session.current_intent,
    'sentiment', COALESCE(v_session.sentiment, 'neutral'),
    'conversation_stage', COALESCE(v_session.conversation_stage, 'greeting'),
    'turn_count', COALESCE(v_session.turn_count, 0),
    'menu_items', COALESCE(v_menu_items, '[]'::jsonb),
    'doctors', COALESCE(v_doctors, '[]'::jsonb),
    'packages', COALESCE(v_packages, '[]'::jsonb)
  );

  RETURN v_result;
END;
$function$;