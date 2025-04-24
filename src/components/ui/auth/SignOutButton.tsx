"use client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const handleClick = async () => {
    const router = useRouter();
    const res = await fetch("/api/auth/signOut", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      console.log("Logged Out");
      router.push("/account");
    } else {
      console.log("Error");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="border-1 min-w-20 min-h-10 m-4 bg-gray-200 rounded-sm cursor-pointer hover:bg-yellow-600"
    >
      Sign Out
    </button>
  );
}
