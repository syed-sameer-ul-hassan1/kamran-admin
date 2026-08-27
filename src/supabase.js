import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_DATABASE_URL;
const supabaseKey = import.meta.env.VITE_DATABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: window.sessionStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
