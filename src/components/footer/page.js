import Link from "next/link";
import Image from "next/image";
import { MdEmail } from "react-icons/md";
import { ShieldCheck } from "lucide-react";
import favicon from "../../../public/favicon.png";

const columns = [
  {
    title: "Learn",
    links: [
      { label: "Browse courses", href: "/#courses" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "My learning", href: "/dashboard" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Teach",
    links: [
      { label: "Creator dashboard", href: "/creator-dashboard" },
      { label: "Create a course", href: "/creator-dashboard/create-course" },
      { label: "Creator agreement", href: "/creator-agreement" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image src={favicon} alt="" width={28} height={28} className="h-7 w-7" />
              <span className="text-lg font-extrabold tracking-tight text-white">
                Dagu<span className="text-brand-400">Learn</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Ethiopia&apos;s first YouTube course monetization platform. Creators
              turn their lessons into structured courses, learners pay once in
              Birr and learn at their own pace.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <a
              href="mailto:contact@dagulearn.com"
              className="mt-4 flex items-center gap-2 text-sm transition hover:text-white"
            >
              <MdEmail className="shrink-0" /> contact@dagulearn.com
            </a>
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs">
              <ShieldCheck size={16} className="text-emerald-400" />
              Payments secured by Chapa
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs">
          © {new Date().getFullYear()} DaguLearn. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
