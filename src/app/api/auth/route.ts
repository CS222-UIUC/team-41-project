import { supabase } from "@/lib/supabase/client";
import { NextApiRequest, NextApiResponse } from 'next';
//import type { NextRequest, NextResponse } from 'next/server'

  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })
      if (error) {
        console.error("Error signing up:", error.message);
      } else {
        console.log("User registered, check email for verification link:", data);
      }
    }
  }
 // incorporate into signin handler
  // const signIn = async () => {
  //   const { data, error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   })

  //   if (error) {
  //   } else {
  //     alert('Signed in successfully!')
  //   }
  // }

  // Handle input changes
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target
  //   if (name === 'email') {
  //     setEmail(value)
  //   } else if (name === 'password') {
  //     setPassword(value)
  //   }
  // }
  // incorporate into sign out handler
  // const signOut = async () => {
  //   const { error } = await supabase.auth.signOut()
  //   if (error) {
  //     } else {
  //       alert('Signed out successfully!')
  //     }
  // }