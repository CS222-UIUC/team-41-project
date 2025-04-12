import { supabase } from "@/lib/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") { // login
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error("Error logging in:", error.message);
    } else {
      console.log("User logged in successfully:", data.user);
    }
  }
}
