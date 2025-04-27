import AccountCard from "@/components/ui/auth/AccountCard";
import { Suspense } from 'react';

export default function Create() {
  return (
    <div>
      <Suspense>
        <AccountCard />
      </Suspense>
    </div>
  );
}
