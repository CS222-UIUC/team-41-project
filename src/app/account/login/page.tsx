import SignInCard from "@/components/ui/auth/SignInCard";
import { Suspense } from "react";

export default function Login() {
  return (
    <div>
      <Suspense>
        <SignInCard />
      </Suspense>
    </div>
  );
}
