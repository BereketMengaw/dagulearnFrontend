import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, PlayCircle } from "lucide-react";
import { fetchEnrollmentsCount } from "../../lib/api";
import { formatPrice, courseHref } from "@/lib/format";

// enrollmentCount can be passed in by a parent that already fetched it;
// otherwise the card fetches its own.
const CourseCard = ({ course, isTopSeller, enrollmentCount: passedCount }) => {
  const [fetchedCount, setFetchedCount] = useState(null);

  useEffect(() => {
    if (passedCount !== undefined || !course?.id) return;
    fetchEnrollmentsCount(course.id)
      .then((data) => setFetchedCount(data?.enrollmentCount ?? 0))
      .catch(() => setFetchedCount(0));
  }, [course?.id, passedCount]);

  const enrollmentCount = passedCount ?? fetchedCount;
  const thumbnailUrl = course.thumbnail || "/images/Thumbnail.jpg";
  const creatorName = course.creator?.name || "DaguLearn creator";

  return (
    <Link
      href={courseHref(course)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <Image
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={thumbnailUrl}
          width={640}
          height={360}
          alt={course.title || "Course thumbnail"}
        />
        {isTopSeller && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-950 shadow">
            Bestseller
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition group-hover:bg-slate-950/30 group-hover:opacity-100">
          <PlayCircle size={44} className="text-white drop-shadow-lg" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="mb-2 w-fit rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
          {course.category?.name || "General"}
        </span>
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 group-hover:text-brand-700">
          {course.title?.trim()}
        </h3>
        <p className="mt-1 text-xs text-slate-500">{creatorName}</p>
        <p className="mb-4 mt-2 line-clamp-2 text-sm text-slate-600">
          {course.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-lg font-extrabold text-slate-900">
            {formatPrice(course.price)}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Users size={14} />
            {enrollmentCount == null ? (
              <span className="inline-block h-3 w-12 animate-pulse rounded bg-slate-200" />
            ) : (
              `${enrollmentCount} enrolled`
            )}
          </span>
        </div>
      </div>
    </Link>
  );
};

export const CourseCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div className="aspect-video animate-pulse bg-slate-100" />
    <div className="space-y-3 p-4">
      <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
      <div className="h-5 w-full animate-pulse rounded bg-slate-100" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
      <div className="h-6 w-24 animate-pulse rounded bg-slate-100" />
    </div>
  </div>
);

export default CourseCard;
