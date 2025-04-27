import SignOutButton from "@/components/ui/auth/SignOutButton";
// import { createClient } from "@/lib/supabase/server";
// import { redirect } from "next/navigation";

export default async function Dashboard() {
  // const supabase = await createClient();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   return redirect("/account");
  // }

  return (
    <>
      <h1>Protected Dashboard page</h1>
      <SignOutButton />
    </>
  );
}
