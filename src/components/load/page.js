import React from "react";
import Image from "next/image";
import loading from "../../../public/favicon.png";

function page() {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ">
          <Image src={loading} alt="dagulearn" />
        </div>
      </div>
    </div>
  );
}

export default page;
