import Link from 'next/link';
import React from 'react'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

        <h1 className="mb-2 text-3xl font-bold text-blue-950">
          Create Account
        </h1>

        <p className="mb-6 text-blue-600">
          Register a new account
        </p>

        <form className="space-y-4">

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-500">
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-lg border px-4 py-3 text-gray-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-500">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border px-4 py-3 text-gray-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-500">
              Password
            </label>

            <input
              type="password"
              placeholder="Create password"
              className="w-full rounded-lg border px-4 py-3 text-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-950 py-3 font-medium text-white"
          >
            Register
          </button>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 py-3 font-medium text-white"
          >
            <Link href={'login'}>Log In</Link>
          </button>

          <Link href={'/'} className='text-blue-500'>Go back to Home page</Link>

        </form>

      </div>
    </div>
  );
}
