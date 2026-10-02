"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  Wallet,
  UserCog,
  FileText,
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";

const nav = [
  { href: "/creator-dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/creator-dashboard/my-courses", label: "My courses", icon: BookOpen, also: /^\/(courses\/|creator-dashboard\/\d+)/ },
  { href: "/creator-dashboard/create-course", label: "Create course", icon: PlusCircle },
  { href: "/creator-dashboard/enrollments", label: "Enrollments", icon: Users },
  { href: "/creator-dashboard/earnings", label: "Earnings", icon: Wallet },
  { href: "/creator-dashboard/register", label: "Creator profile", icon: UserCog },
  { href: "/creator-agreement", label: "Agreement", icon: FileText },
];

// Shared frame for every creator-side page: top navbar, studio sidebar, page header.
export default function StudioShell({ title, subtitle, actions, children }) {
  const pathname = usePathname();
  const isActive = (item) =>
    item.exact
      ? pathname === item.href
      : pathname?.startsWith(item.href) || (item.also && item.also.test(pathname || ""));

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-72px)] bg-slate-50">
        <div className="container-page grid gap-8 py-8 lg:grid-cols-[230px_1fr] lg:py-10">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow mb-3 hidden px-3 lg:block">Creator studio</p>
            <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 scrollbar-hidden lg:mx-0 lg:flex-col lg:px-0">
              {nav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-white text-brand-700 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-600 hover:bg-white hover:text-slate-900"
                    }`}
                  >
                    <Icon size={18} className={active ? "text-brand-600" : "text-slate-400"} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="min-w-0">
            {(title || actions) && (
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  {title && (
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                      {title}
                    </h1>
                  )}
                  {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
                </div>
                {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

export const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white p-6 ${className}`}>{children}</div>
);

export const Field = ({ label, hint, htmlFor, children }) => (
  <div>
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
    </label>
    {children}
    {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
  </div>
);

export const StudioLoading = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200/70" />
    ))}
  </div>
);

// Hides all but the last 4 digits, e.g. "•••• 5707".
export const maskAccount = (n) => (n ? `•••• ${String(n).slice(-4)}` : "—");
