import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(
  "https://pkngusejxcbfbargumym.supabase.co",
  "sb_publishable_KNoJ5rpZ2NDowgsck3LfXA_OIDNkFWq",
);
