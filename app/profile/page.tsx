import { requireUser } from "@/lib/auth";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await requireUser();

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">
            ACCOUNT
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-white/50">
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 text-4xl font-bold shadow-xl">
              {initial}
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {user.name}
              </h2>

              <p className="mt-1 text-sm text-white/50">
                {user.email}
              </p>

              <span className="mt-3 inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                {user.role}
              </span>
            </div>
          </div>

          <div className="my-8 border-t border-white/10" />

          {/* Information */}
          <div className="grid gap-5 sm:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/40">
                Full Name
              </p>

              <p className="mt-1 font-semibold">
                {user.name}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/40">
                Email Address
              </p>

              <p className="mt-1 break-all font-semibold">
                {user.email}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/40">
                Phone Number
              </p>

              <p className="mt-1 font-semibold">
                {user.phone || "Not provided"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/40">
                Account Type
              </p>

              <p className="mt-1 font-semibold capitalize">
                {user.role}
              </p>
            </div>

          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-3">

            <Link
              href={
                user.role === "admin"
                  ? "/dashboard/admin"
                  : "/dashboard"
              }
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition hover:scale-[1.02]"
            >
              Go to Dashboard
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold transition hover:bg-white/[0.08]"
            >
              Back to Home
            </Link>

          </div>
        </div>
      </div>
    </main>
  );
}