"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search, ShieldCheck, PlayCircle, Wallet } from "lucide-react";

const Hero = ({ user, stats, onAuth }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/?q=${encodeURIComponent(q)}#courses` : "/#courses");
  };

  const isCreator = user?.role === "creator";

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
      <div className="absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-brand-600/30 blur-[120px]" />
      <div className="absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[120px]" />

      <div className="container-page relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        {/* Copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Ethiopia&apos;s first YouTube course monetization platform
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Learn real skills from{" "}
            <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-amber-300 bg-clip-text text-transparent">
              creators you trust
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Structured courses built from the best Ethiopian YouTube teachers.
            Watch the first chapter free, pay once in Birr, and keep learning at
            your own pace.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you want to learn?"
                aria-label="Search courses"
                className="w-full rounded-xl border border-white/10 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/40"
              />
            </div>
            <button type="submit" className="btn-primary py-3.5">
              Find a course <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
            {user ? (
              <Link
                href={isCreator ? "/creator-dashboard" : "/dashboard"}
                className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-brand-300"
              >
                {isCreator ? "Go to creator dashboard" : "Continue learning"}
                <ArrowRight size={14} />
              </Link>
            ) : (
              <button
                onClick={() => onAuth("signup")}
                className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-brand-300"
              >
                Teach on DaguLearn <ArrowRight size={14} />
              </button>
            )}
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-400" />
              Secure payments with Chapa
            </span>
          </div>

          {/* Stats */}
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              { label: "Courses", value: stats.courses },
              { label: "Creators", value: stats.creators },
              { label: "Enrollments", value: stats.enrollments },
            ].map((s) => (
              <div key={s.label}>
                <dt className="text-xs uppercase tracking-wider text-slate-400">
                  {s.label}
                </dt>
                <dd className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                  {s.value == null ? (
                    <span className="inline-block h-7 w-10 animate-pulse rounded bg-white/10" />
                  ) : (
                    s.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-brand-950/50">
            <Image
              src="/images/hero.png"
              alt="A student learning on a laptop"
              width={1344}
              height={768}
              priority
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent" />
          </div>

          <div className="absolute -left-4 bottom-8 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 text-slate-900 shadow-xl sm:-left-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <PlayCircle size={20} />
            </span>
            <div>
              <p className="text-sm font-bold">Chapter 1 is free</p>
              <p className="text-xs text-slate-500">Try before you buy</p>
            </div>
          </div>

          <div className="absolute -right-2 top-6 hidden items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 text-slate-900 shadow-xl sm:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet size={18} />
            </span>
            <div>
              <p className="text-sm font-bold">Pay in Birr</p>
              <p className="text-xs text-slate-500">Telebirr, CBE Birr, cards</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
