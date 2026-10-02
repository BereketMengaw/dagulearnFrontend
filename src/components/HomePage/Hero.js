"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";

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
    <section className="relative overflow-hidden bg-neutral-900 text-white">
      {/* Abrehot library */}
      <Image
        src="/images/bgimgtwo.jpg"
        alt=""
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/55 lg:bg-gradient-to-r lg:from-black/85 lg:via-black/45 lg:to-transparent" />

      <div className="container-page relative flex min-h-[calc(100svh-72px)] items-center py-16 sm:py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Ethiopia&apos;s first YouTube course monetization platform
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Learn real skills from{" "}
            <span className="text-brand-300">creators you trust</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
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

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/75">
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
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-white/20 pt-8">
            {[
              { label: "Courses", value: stats.courses },
              { label: "Creators", value: stats.creators },
              { label: "Enrollments", value: stats.enrollments },
            ].map((s) => (
              <div key={s.label}>
                <dt className="text-xs uppercase tracking-wider text-white/60">
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

      </div>
    </section>
  );
};

export default Hero;
