import React from "react";
import Logo from "../../assets/ogis.png";

function Sidebar() {
  return (
    <div>
      <div className="py-5">
        <img src={Logo} alt="OGIS Logo" className="img-fluid" />
      </div>
      <hr className="m-0" />
      <div className={`py-2 px-4 mt-1`}>
       {/*  <i className={`${icon}`}></i> */}
        <span className="px-2">Dashboard</span>
      </div>
    </div>
  );
}

export default Sidebar;
