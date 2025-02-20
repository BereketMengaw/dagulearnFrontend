"use client";

import React from "react";
import CourseList from "../../components/CourseList/courseList"; // Import the CourseList component
import Navbar from "@/components/Navbar/Navbar";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800">
          My Purchased Courses
        </h1>
        <CourseList /> {/* Use the CourseList component here */}
      </div>
    </>
  );
};

export default Dashboard;
