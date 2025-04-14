import React from "react";

function ContactUs() {
  return (
    <div>
      <div className="rounded border mt-2">
        <div className="d-flex justify-between ">
          <div className="d-flex bg-light-gray w-100 p-2">
            <h5 className="p-0 m-0">
              <i className="fa fa-phone px-2" aria-hidden="true"></i>
            </h5>
            <h6 className="p-0 m-0">Contact Us </h6>
          </div>
        </div>
        <div className="py-3 px-4">
          <div className="border p-2">
            <div>
              <div className="">
                <div>
                  <small className="m-0 px-1 fw-bold">Email :</small>
                </div>
                <div>
                  <small className="m-0 px-1">
                    ftmanagedservices@ogis-ph.com
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="border p-2">
            <div>
              <div className="">
                <div>
                  <small className="m-0 px-1 fw-bold">Phone: :</small>
                </div>
                <div>
                  <small className="m-0 px-1">+63956 325 3392</small>
                </div>
                <div>
                  <small className="m-0 px-1">+63917 512 2176</small>
                </div>
                <div>
                  <small className="m-0 px-1">+63915 343 4354</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
