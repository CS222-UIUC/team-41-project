import SignOutButton from "@/components/ui/auth/SignOutButton";
import CheckSession from "@/components/ui/auth/CheckSession";

export default function Dashboard() {
  return (
    <CheckSession>
      <h1>Dashboard page</h1>
      <SignOutButton />
    </CheckSession>
  );
}
