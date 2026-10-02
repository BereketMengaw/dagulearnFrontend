"use client";

import React, { useState } from "react";
import CourseList from "../../components/CourseList/courseList";
import Navbar from "@/components/Navbar/Navbar";
import AuthPopup from "@/app/auth/AuthPopup";

const Dashboard = () => {
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  return (
    <>
      <Navbar setShowAuthPopup={setShowAuthPopup} />
      {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}
      <div className="min-h-[70vh] bg-slate-50">
        <div className="container-page py-10 sm:py-14">
          <p className="eyebrow">My learning</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Your courses
          </h1>
          <div className="mt-8">
            <CourseList onLogin={() => setShowAuthPopup(true)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
