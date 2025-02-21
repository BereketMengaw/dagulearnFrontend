import { useState } from "react";
import Image from "next/image";
import DownwardButton from "./DownButton";
import Modal from "../Popup/Popup"; // Import the Modal component

const Hero = () => {
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  const teacherSteps = [
    "Sign up and log in as a creator.",
    "Register as a creator.",
    "Access the dashboard to create your course.",
    "Start earning unlimited monthly income.",
  ];

  const studentSteps = [
    "Sign up or log in as a student.",
    "Choose any course you want.",
    "Purchase the course.",
    "Enjoy the class and start learning.",
  ];

  return (
    <>
      <div className="pb-2">
        <section className="flex flex-col-reverse lg:flex-row items-center bg-white bg-cover bg-center h-1/2 py-5 px-6 lg:px-24">
          {/* Left Side Text */}
          <div className="lg:w-1/2 text-center lg:text-left space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-snug">
              Learn from Anyone, Teach Anything
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Empowering educators and students to connect and share knowledge
              for better, quality education. Experience seamless learning
              opportunities from anywhere.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
              <button
                onClick={() => setIsTeacherModalOpen(true)}
                className="px-6 sm:px-8 py-3 bg-blue-600 text-white text-sm sm:text-lg font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Be a Teacher
              </button>
              <button
                onClick={() => setIsStudentModalOpen(true)}
                className="px-6 sm:px-8 py-3 bg-blue-600 text-white text-sm sm:text-lg font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Start Learning
              </button>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-lg">
              <Image
                src="/images/hero2.png" // Replace with your image path
                alt="Learning Image"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
        <DownwardButton />
      </div>

      {/* Teacher Modal */}
      <Modal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        title="How to Become a Teacher"
        steps={teacherSteps}
      />

      {/* Student Modal */}
      <Modal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        title="How to Become a Student"
        steps={studentSteps}
      />
    </>
  );
};

export default Hero;
