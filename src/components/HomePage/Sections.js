"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  PlayCircle,
  CreditCard,
  GraduationCap,
  Youtube,
  Layers,
  Wallet,
  ShieldCheck,
  Smartphone,
  Infinity as InfinityIcon,
  ArrowRight,
  Plus,
} from "lucide-react";

const steps = {
  students: [
    {
      icon: Search,
      title: "Find your course",
      body: "Browse by category or search for the exact skill you want to learn.",
    },
    {
      icon: PlayCircle,
      title: "Watch chapter 1 free",
      body: "Every course opens its first chapter so you can judge the teaching first.",
    },
    {
      icon: CreditCard,
      title: "Pay once with Chapa",
      body: "Unlock every chapter with Telebirr, CBE Birr or card. No subscription.",
    },
    {
      icon: GraduationCap,
      title: "Learn at your pace",
      body: "Videos, links and PDFs for each chapter, waiting in My learning.",
    },
  ],
  creators: [
    {
      icon: Youtube,
      title: "Bring your YouTube lessons",
      body: "Keep hosting on YouTube. Paste your video links into chapters.",
    },
    {
      icon: Layers,
      title: "Build a structured course",
      body: "Add chapters, resources and a thumbnail from your creator dashboard.",
    },
    {
      icon: CreditCard,
      title: "Set your price",
      body: "Learners preview chapter 1 and pay in Birr to unlock the rest.",
    },
    {
      icon: Wallet,
      title: "Keep 80% of every sale",
      body: "Track enrollments and earnings live. DaguLearn keeps 20% to run the platform.",
    },
  ],
};

export const HowItWorks = () => {
  const [tab, setTab] = useState("students");

  return (
    <section id="how-it-works" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            From YouTube video to a course worth paying for
          </h2>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full bg-slate-100 p-1">
            {[
              ["students", "For students"],
              ["creators", "For creators"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  tab === key
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps[tab].map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5"
            >
              <span className="absolute right-5 top-5 text-4xl font-extrabold text-slate-100">
                {i + 1}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon size={22} />
              </span>
              <h3 className="mt-5 font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export const TrustStrip = () => (
  <section className="border-y border-slate-200 bg-white">
    <div className="container-page grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
      {[
        { icon: ShieldCheck, title: "Secure checkout", body: "Payments processed by Chapa" },
        { icon: Smartphone, title: "Pay your way", body: "Telebirr, CBE Birr and cards" },
        { icon: PlayCircle, title: "Free preview", body: "Chapter 1 of every course" },
        { icon: InfinityIcon, title: "Pay once", body: "No subscription, no renewals" },
      ].map(({ icon: Icon, title, body }) => (
        <div key={title} className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Icon size={20} />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">{title}</p>
            <p className="text-xs text-slate-500">{body}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const CreatorCTA = ({ user, onAuth }) => {
  const isCreator = user?.role === "creator";

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-12 text-white sm:px-12 sm:py-16">
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">
                For creators
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Your YouTube lessons can pay you directly
              </h2>
              <p className="mt-4 max-w-xl text-slate-300">
                Package the videos you already make into a paid course. You set
                the price, learners pay in Birr, and you keep 80% of every sale.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {isCreator ? (
                  <Link href="/creator-dashboard/create-course" className="btn-primary">
                    Create a course <ArrowRight size={16} />
                  </Link>
                ) : user ? (
                  <Link href="/creator-agreement" className="btn-primary">
                    Read the creator terms <ArrowRight size={16} />
                  </Link>
                ) : (
                  <button onClick={() => onAuth("signup")} className="btn-primary">
                    Start teaching <ArrowRight size={16} />
                  </button>
                )}
                <Link
                  href="/creator-agreement"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Creator agreement
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                ["80%", "of each sale goes to you"],
                ["Your price", "you decide what to charge"],
                ["Live", "enrollment & earnings stats"],
                ["YouTube", "keeps hosting your videos"],
              ].map(([big, small]) => (
                <div key={small} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-2xl font-extrabold">{big}</p>
                  <p className="mt-1 text-xs text-slate-400">{small}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const faqs = [
  {
    q: "Can I try a course before paying?",
    a: "Yes. Chapter 1 of every course is free to watch. Open any course and click the first chapter.",
  },
  {
    q: "How do I pay?",
    a: "Click Buy now on the course page and you'll be taken to Chapa's secure checkout, where you can pay with Telebirr, CBE Birr or a bank card.",
  },
  {
    q: "Is it a subscription?",
    a: "No. You pay once per course and keep access to all of its chapters.",
  },
  {
    q: "Where do I find the courses I bought?",
    a: "Log in and open My learning from your profile menu. Every purchased course is listed there.",
  },
  {
    q: "How do creators get paid?",
    a: "Creators keep 80% of each sale and can follow enrollments and earnings from the creator dashboard. The full terms are in the creator agreement.",
  },
];

export const FAQ = () => (
  <section id="faq" className="scroll-mt-20 bg-slate-50 py-16 sm:py-24">
    <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr]">
      <div>
        <p className="eyebrow">FAQ</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Questions, answered
        </h2>
        <p className="mt-3 text-slate-600">
          Still stuck? Email{" "}
          <a href="mailto:contact@dagulearn.com" className="font-semibold text-brand-700 hover:underline">
            contact@dagulearn.com
          </a>
          .
        </p>
      </div>
      <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {faqs.map(({ q, a }) => (
          <details key={q} className="group p-5 sm:p-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
              {q}
              <Plus size={18} className="shrink-0 text-slate-400 transition group-open:rotate-45" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);
