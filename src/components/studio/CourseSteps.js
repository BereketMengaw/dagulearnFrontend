import { Check } from "lucide-react";

const steps = ["Course details", "Thumbnail", "Chapters & videos"];

// Progress indicator for the three-step course creation flow.
export default function CourseSteps({ current }) {
  return (
    <ol className="mb-8 flex flex-wrap items-center gap-3 text-sm">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex items-center gap-3">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                done
                  ? "bg-emerald-500 text-white"
                  : active
                  ? "bg-brand-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {done ? <Check size={14} /> : n}
            </span>
            <span className={active ? "font-semibold text-slate-900" : "text-slate-500"}>{label}</span>
            {n < steps.length && <span className="hidden h-px w-8 bg-slate-300 sm:block" />}
          </li>
        );
      })}
    </ol>
  );
}
