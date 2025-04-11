import React from "react";
import Logo from "../../assets/ogis.png"
import FMS from "../../assets/fms.png"
import Sidebar from "./Sidebar";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-white bg-light-gray w-100 position-fixed m-0 p-0 top-0">
      <div className="">
        <div className="">
          <div className="d-flex align-items-center w-13 justify-content-center p-1">
            <img src={FMS} alt="logo" height="65rem" className=""/>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
