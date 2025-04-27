"use client";

import { useSearchParams } from "next/navigation";
import { signInAction } from "@/app/actions";

export default function SignInCard() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const message = searchParams.get("message");

  return (
    <div className="object-center flex items-center justify-center columns-1 border-24 rounded-xl border-gray-100 m-4 w-100 h-130 bg-blue-25 mx-150 my-40 shadow-lg">
      <form action={signInAction}>
        <h1 className="text-2xl font-semibold m-8 text-center">Sign In:</h1>

        <label htmlFor="email" className="m-4">
          Email:
        </label>
        <br />
        <input
          type="email"
          name="email"
          required
          className="border-1 border-black-500 min-w-20 min-h-10 m-4 rounded-sm bg-neutral-50"
          placeholder="Enter your email"
        />
        <br />

        <label htmlFor="password" className="m-4">
          Password:
        </label>
        <br />
        <input
          type="password"
          name="password"
          required
          className="border-1 border-black-500 min-w-20 min-h-10 m-4 rounded-sm bg-neutral-50"
          placeholder="Enter your password"
        />
        <br />

        <button
          className="border-1 min-w-20 min-h-10 m-4 bg-gray-200 rounded-sm cursor-pointer hover:bg-yellow-600"
          type="submit"
        >
          Submit
        </button>

        {status && message && (
          <p className={`m-4 text-sm ${status === "error" ? "text-red-500" : "text-green-600"}`}>
            {decodeURIComponent(message)}
          </p>
        )}
      </form>
    </div>
  );
}
