import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function PUT(req: NextRequest) {
    const { email, password } = await req.json();
  
    if (!email || !password) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }
  
    const { data, error } = await supabase.auth.signUp({ email, password });
  
    if (error) {
      console.error("Error signing up:", error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  
    return NextResponse.json({ message: "User created", user: data }, { status: 200 });
}