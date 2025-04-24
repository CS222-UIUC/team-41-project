import { supabase } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Try to log out the user
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logging out:", error.message);
    return NextResponse.json({ message: "Failed to log out" }, { status: 500 });
  }

  console.log("User logged out successfully");

  return NextResponse.json({ message: "User logged out successfully" });
}