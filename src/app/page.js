// /app/page.js
"use client";

import { useEffect, useState } from "react";
import CourseCard from "../components/HomePage/CourseCard";
import Hero from "../components/HomePage/Hero";
import { fetchCourses } from "../lib/fetcher";
import Category from "@/components/HomePage/Category";
import Navbar from "@/components/Navbar/Navbar";
import DownButton from "@/components/HomePage/DownButton";
import CategoryList from "@/components/HomePage/Category";

const HomePage = () => {
  const handleScroll = () => {
    const targetSection = document.getElementById("target-section");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <div className="w-full max-w-full">
        <Navbar />
        <Hero />
        <Category />
      </div>
    </>
  );
};

export default HomePage;
