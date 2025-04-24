'use client';
import { useRouter } from 'next/navigation';

export default function Account() {
  const router = useRouter();

  return (
    <div>
      <button onClick={() => router.push('/account/create')} className="border-1 min-w-20 min-h-10 m-4 bg-gray-200 rounded-sm cursor-pointer hover:bg-yellow-600">
      Create New Account
      </button>
      <button onClick={() => router.push('/account/login')} className="border-1 min-w-20 min-h-10 m-4 bg-gray-200 rounded-sm cursor-pointer hover:bg-yellow-600">
      Login
      </button>
    </div>
  );
}
