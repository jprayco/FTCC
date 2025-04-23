import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { NavLink } from "react-router-dom";

function Template({ children }) {
  return (
    <div className="">
      <div className=" bg-light">
        <div className="">
          <Navbar />
          <div className="d-flex m-0 p-0 vh-100 overflow-hidden bg-white">
           {/*  <div className="w-18 bg-gray d-lg-block d-md-none d-sm-none d-none">
              <NavLink to="/" className="decoration-none  ticket-nav">
                <div className="mt-10 py-2 px-4 ticket-nav">
                  <i className="fa fa-ticket" aria-hidden="true"></i> Ticket
                </div>
              </NavLink>
            </div> */}
            <div className="mt-10 bg-white w-100 vh-90 overflow-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Template;
