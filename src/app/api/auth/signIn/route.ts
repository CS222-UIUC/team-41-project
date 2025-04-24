import { supabase } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }

  // Try to sign in with email and password
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error logging in:", error.message);
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  console.log("User logged in successfully:", data.user);

  return NextResponse.json({
    message: "User logged in successfully",
    user: data.user,
  });
}