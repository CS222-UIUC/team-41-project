import { supabase } from "@/lib/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";
// import type { NextRequest, NextResponse } from 'next/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      console.error("Error signing up:", error.message);
    } else {
      console.log("User registered, check email for verification link:", data);
    }
  } else {
    console.log("request not 'PUT'");
  }
}
