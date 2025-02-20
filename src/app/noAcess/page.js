import Navbar from "@/components/Navbar/Navbar";
import React from "react";

function page() {
  return (
    <div>
      <Navbar />
      <h1 className="text align-center px-28 bg-red-600 mx-28  mt-14">
        you have no access for the page
      </h1>
    </div>
  );
}

export default page;
