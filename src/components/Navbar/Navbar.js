"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  X,
  Search,
  PlayCircle,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  GraduationCap,
  Clapperboard,
  FileText,
  UserCog,
} from "lucide-react";
import Modal from "../popupVideo/popup";
import AuthPopup, { authTabHint } from "@/app/auth/AuthPopup";
import favicon from "../../../public/favicon.png";

const videos = {
  student: "https://www.youtube.com/embed/cggp1iwYA4w",
  creator: "https://www.youtube.com/embed/cggp1iwYA4w",
};

// Closes a dropdown when the user clicks anywhere outside it.
function useOutsideClose(ref, open, close) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, open, close]);
}

const Dropdown = ({ label, children, align = "left" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutsideClose(ref, open, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-900/10`}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ icon: Icon, title, hint, href, onClick, danger }) => {
  const cls = `flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${
    danger ? "hover:bg-red-50" : "hover:bg-slate-50"
  }`;
  const body = (
    <>
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          danger ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-600"
        }`}
      >
        <Icon size={16} />
      </span>
      <span>
        <span
          className={`block text-sm font-semibold ${
            danger ? "text-red-600" : "text-slate-900"
          }`}
        >
          {title}
        </span>
        {hint && <span className="block text-xs text-slate-500">{hint}</span>}
      </span>
    </>
  );
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <button onClick={onClick} className={cls}>
      {body}
    </button>
  );
};

const Navbar = ({ setShowAuthPopup }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [userData, setUserData] = useState(null);
  const [query, setQuery] = useState("");
  const [localAuthOpen, setLocalAuthOpen] = useState(false);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      setUserName(parsedUser.name || "Guest");
    }
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q);
  }, []);

  // Pages that don't manage their own auth popup still get a working login button.
  const openAuth = (tab = "login") => {
    authTabHint.next = tab;
    setIsMobileMenuOpen(false);
    if (setShowAuthPopup) setShowAuthPopup(true);
    else setLocalAuthOpen(true);
  };

  const openVideoModal = (videoType) => {
    setSelectedVideo(videos[videoType]);
    setIsVideoModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUserData(null);
    setUserName("Guest");
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    setIsMobileMenuOpen(false);
    router.push(q ? `/?q=${encodeURIComponent(q)}#courses` : "/#courses");
  };

  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isCreator = userData?.role === "creator";

  const searchForm = (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search
        size={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for courses"
        aria-label="Search for courses"
        className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15"
      />
    </form>
  );

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/85 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center gap-4 lg:h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src={favicon}
            className="h-8 w-8"
            alt="DaguLearn logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Dagu<span className="text-brand-600">Learn</span>
          </span>
        </Link>

        {/* Search (desktop) */}
        <div className="mx-2 hidden max-w-md flex-1 md:block">{searchForm}</div>

        {/* Desktop Menu */}
        <div className="ml-auto hidden items-center gap-1 md:flex">
          <Dropdown label="How it works">
            <MenuItem
              icon={GraduationCap}
              title="For students"
              hint="Find a course, pay with Chapa, start learning"
              onClick={() => openVideoModal("student")}
            />
            <MenuItem
              icon={Clapperboard}
              title="For creators"
              hint="Turn your YouTube lessons into income"
              onClick={() => openVideoModal("creator")}
            />
          </Dropdown>

          {isCreator && (
            <Dropdown label="Creator">
              <MenuItem
                icon={LayoutDashboard}
                title="Creator dashboard"
                hint="Courses, enrollments, earnings"
                href="/creator-dashboard"
              />
              <MenuItem
                icon={UserCog}
                title="Creator info"
                hint="Your public profile"
                href="/creator-dashboard/register"
              />
              <MenuItem
                icon={FileText}
                title="Creator agreement"
                href="/creator-agreement"
              />
            </Dropdown>
          )}

          {userData ? (
            <Dropdown
              align="right"
              label={
                <span className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                    {initials}
                  </span>
                  <span className="hidden max-w-[120px] truncate lg:inline">
                    {userName}
                  </span>
                </span>
              }
            >
              <div className="border-b border-slate-100 px-3 pb-3 pt-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {userName}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {userData.gmail || userData.phoneNumber}
                </p>
              </div>
              <div className="pt-1">
                <MenuItem
                  icon={PlayCircle}
                  title="My learning"
                  hint="Courses you've purchased"
                  href="/dashboard"
                />
                <MenuItem
                  icon={LogOut}
                  title="Log out"
                  onClick={handleLogout}
                  danger
                />
              </div>
            </Dropdown>
          ) : (
            <>
              <button
                onClick={() => openAuth()}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Log in
              </button>
              <button onClick={() => openAuth("signup")} className="btn-primary py-2.5">
                Sign up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="ml-auto rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          onClick={() => setIsMobileMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-100 bg-white md:hidden">
          <div className="container-page space-y-5 py-5">
            {searchForm}

            {userData && (
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {userName}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {userData.gmail || userData.phoneNumber}
                  </p>
                </div>
              </div>
            )}

            <div>
              <p className="eyebrow mb-1 px-3">How it works</p>
              <MenuItem
                icon={GraduationCap}
                title="For students"
                onClick={() => openVideoModal("student")}
              />
              <MenuItem
                icon={Clapperboard}
                title="For creators"
                onClick={() => openVideoModal("creator")}
              />
            </div>

            {isCreator && (
              <div>
                <p className="eyebrow mb-1 px-3">Creator</p>
                <MenuItem
                  icon={LayoutDashboard}
                  title="Creator dashboard"
                  href="/creator-dashboard"
                />
                <MenuItem
                  icon={UserCog}
                  title="Creator info"
                  href="/creator-dashboard/register"
                />
                <MenuItem
                  icon={FileText}
                  title="Creator agreement"
                  href="/creator-agreement"
                />
              </div>
            )}

            {userData ? (
              <div>
                <p className="eyebrow mb-1 px-3">Account</p>
                <MenuItem icon={PlayCircle} title="My learning" href="/dashboard" />
                <MenuItem
                  icon={LogOut}
                  title="Log out"
                  onClick={handleLogout}
                  danger
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => openAuth()} className="btn-secondary">
                  Log in
                </button>
                <button onClick={() => openAuth("signup")} className="btn-primary">
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isVideoModalOpen}
        onClose={closeVideoModal}
        videoUrl={selectedVideo}
      />

      {localAuthOpen && <AuthPopup onClose={() => setLocalAuthOpen(false)} />}
    </nav>
  );
};

export default Navbar;
