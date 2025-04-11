import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Template({children}) {
  return (
    <div className="">
      <div className=" bg-light">
        <div className="">
          <Navbar/>
          <div className=" mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Template;
