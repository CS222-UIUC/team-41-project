import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = "https://rnetsyslaiaptlahqooe.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZXRzeXNsYWlhcHRsYWhxb29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMjA0NjAsImV4cCI6MjA1NjY5NjQ2MH0._iP4MtWkHMbTsGZ4UNCK7MP6-dNnclAhOK9v_icGihU"
 
// can't read environment variables on my computer >:( only issue stopping supabase auth from working

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key not found in environment");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
