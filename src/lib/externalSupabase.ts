import { createClient } from "@supabase/supabase-js";

const EXTERNAL_SUPABASE_URL = "https://cypgnhtwazinvvuipxct.supabase.co";
const EXTERNAL_SUPABASE_ANON_KEY = "sb_publishable_YTMUByF1tykzNAOkGtTOHQ_dUuOXQ3B";

export const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY);
