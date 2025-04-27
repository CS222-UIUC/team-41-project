'use client';

import { signOutAction } from '@/app/actions';

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="border-1 min-w-20 min-h-10 m-4 bg-gray-200 rounded-sm cursor-pointer hover:bg-yellow-600"
      >
        Sign Out
      </button>
    </form>
  );
}
