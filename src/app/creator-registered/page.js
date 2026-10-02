"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import StudioShell, { Card } from "@/components/studio/StudioShell";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const CreatorRegistered = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the homepage after a few seconds
    const t = setTimeout(() => {
      router.push("/");
    }, 5000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <StudioShell>
      <Card className="mx-auto max-w-xl py-12 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={28} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-900">You&apos;re a DaguLearn creator</h1>
        <p className="mt-2 text-slate-600">
          Your creator registration was successful.
        </p>
        <p className="mt-1 text-sm text-slate-500">
          You&apos;ll be redirected to the homepage in a few seconds.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => router.push("/")} className="btn-secondary">
            Go to homepage
          </button>
          <button onClick={() => router.push("/creator-dashboard")} className="btn-primary">
            Open creator studio
          </button>
        </div>
      </Card>
    </StudioShell>
  );
};

export default CreatorRegistered;
