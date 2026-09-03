import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-950 px-6 text-white">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating Code Symbols */}
      <div className="absolute left-[10%] top-[20%] animate-pulse font-mono text-3xl text-blue-500/20">
        {"</>"}
      </div>

      <div className="absolute right-[12%] top-[25%] font-mono text-4xl text-purple-500/20">
        {"{}"}
      </div>

      <div className="absolute bottom-[20%] left-[15%] font-mono text-2xl text-cyan-500/20">
        {"<404 />"}
      </div>

      <div className="absolute bottom-[15%] right-[15%] font-mono text-3xl text-blue-500/20">
        {"01"}
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">

        {/* Small Badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          Page Not Found
        </div>

        {/* 404 */}
        <div className="relative">
          <h1 className="select-none text-[120px] font-black leading-none tracking-tighter sm:text-[180px] md:text-[220px]">
            <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-600 bg-clip-text text-transparent">
              404
            </span>
          </h1>

          {/* Code Overlay */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-xs text-white/20 sm:text-sm">
            ERROR: PAGE_NOT_FOUND
          </div>
        </div>

        {/* Heading */}
        <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
          Oops! This Page Got Lost.
        </h2>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
          The page you are looking for may have been removed, renamed,
          or temporarily unavailable. Don't worry, let's get you back
          to the right place.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500"
          >
            <span>←</span>
            Back to Home
          </Link>

          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-gray-500 hover:bg-white/10"
          >
            Explore Courses
            <span>→</span>
          </Link>

        </div>

        {/* Brand */}
        <div className="mt-12 border-t border-gray-800 pt-6">
          <p className="text-sm font-semibold text-gray-300">
            Next Level School
          </p>

          <p className="mt-1 text-xs text-gray-600">
            Learn Today • Build Your Future
          </p>
        </div>

      </div>
    </main>
  );
}