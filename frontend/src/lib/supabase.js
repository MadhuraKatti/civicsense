import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Prevent a hard crash when env vars are missing (e.g. during local dev
// without a .env file, or when Supabase is not yet configured).
let supabase = null;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. " +
      "Authentication features will be unavailable."
  );

  // Export a no-op stub so callers don't throw on import
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: null, error: new Error("Supabase not configured") }),
      signUp: async () => ({ data: null, error: new Error("Supabase not configured") }),
      signOut: async () => {},
    },
  };
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };
