import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  LINK,
  API_KEY
);
