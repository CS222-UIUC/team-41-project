"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInCard() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await fetch("/api/auth/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      // Redirect or show a success message
      console.log("Logged In");
      router.push("/dashboard");
    } else {
      console.log("Error");
      const data = await res.json();
      console.error(data.message);
    }
  };

  return (
    <div className="object-center flex items-center justify-center columns-1 border-24 rounded-xl border-gray-100 m-4 w-100 h-130 bg-blue-25 mx-150 my-40 shadow-lg">
      <form id="createAccount" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold m-8 text-center">Sign In:</h1>
        <label htmlFor="email" className="m-4">
          Email:
        </label>
        <br />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border-1 border-black-500 min-w-20 min-h-10 m-4 rounded-sm bg-neutral-50"
          placeholder="Enter your email"
        />
        <br />
        <label htmlFor="pword" className="m-4">
          Password:
        </label>
        <br />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
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
      </form>
    </div>
  );
}
