import { supabase } from "@/lib/supabase/client";
import { NextApiRequest, NextApiResponse } from 'next';

  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') { // logout
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error("Error logging out:", error.message);
        } else {
          console.log("User logged out successfully");
        }
      }
  }