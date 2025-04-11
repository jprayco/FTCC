import React from "react";
import Logo from "../../assets/ogis.png"
import Sidebar from "./Sidebar";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-white bg-white w-100 position-fixed m-0 p-0 top-0">
      <div className="container">
        <div className="">
          <div className="d-flex align-items-center">
            <img src={Logo} alt="logo" height="40rem" />
            <div>
              <small className="navbar-brand fw-bold text-blue fs-13 p-0 mx-3">
                SAP Forum
              </small>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
