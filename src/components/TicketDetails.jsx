import React, { useEffect, useRef, useState } from "react";
import { Modal as BootstrapModal } from "bootstrap";

function TicketDetails({ name, date, title, description, attachments }) {
  const modalRef = useRef(null);
const [img, setimg] = useState("")


  // Show modal manually
  const openModal = (url) => {
    const modal = new BootstrapModal(modalRef.current);
    modal.show();
    setimg(url)
  };

  const closeModal = () => {
    const modal = BootstrapModal.getInstance(modalRef.current);
    if (modal) modal.hide();
  };

  useEffect(() => {
    console.log("attachments:", attachments);
  }, []);
  return (
    <div>
      <div className="row m-0 p-0">
        <div className="col-8 mt-2">
          <div className="rounded border">
            <div className="d-flex justify-between ">
              <div className="d-flex bg-light-gray w-100 p-2">
                <h5 className="p-0 m-0">
                  <i className="fa fa-ticket px-2" aria-hidden="true"></i>
                </h5>
                <h5 className="p-0 m-0">Ticket Code: </h5>
              </div>
            </div>
            <div className="py-3 px-4">
              <div className="d-flex py-1">
                <span className="m-0 p-0 fw-bold">Posted by : </span>
                <span className="px-2">{name} </span>
              </div>
              <div className="d-flex py-1">
                <span className="m-0 p-0 fw-bold">Date Posted : </span>
                <span className="px-2">{date}</span>
              </div>

              <div>
                <div className=" p-0">
                  <div className="py-1">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="fw-bold"
                    >
                      Title :
                    </label>
                  </div>
                  <div className="py-1">
                    <input
                      type="text"
                      className="border w-100 p-2"
                      disabled
                      value={title || ""}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className=" p-0">
                  <div className="py-1">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="fw-bold"
                    >
                      Description :
                    </label>
                  </div>
                  <div className="form-group">
                    <textarea
                      className="w-100 p-2"
                      rows="3"
                      value={description || ""}
                      disabled
                    ></textarea>
                  </div>
                </div>
              </div>
              <div>
                {attachments?.length > 0 ? (
                  <label htmlFor="exampleFormControlInput1" className="fw-bold">
                    Attachments :
                  </label>
                ) : (
                  ""
                )}

                <div className="d-flex">
                  {attachments?.map((file) => (
                    <div className="w-13 border mx-1 cursor-pointer" key={file.key} onClick={()=>{openModal(file.signed_url)}}>
                      <img src={file.signed_url} className="img-fluid" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="rounded border mt-3 mb-5">
            <div className="d-flex justify-between ">
              <div className="d-flex bg-light-gray w-100 p-2">
                <h5 className="p-0 m-0">
                  <i className="fa fa-comments-o px-2" aria-hidden="true"></i>
                </h5>
                <h6 className="p-0 m-0">Comment/s </h6>
              </div>
            </div>
            <div className="py-3 px-4">
              <div className="border p-2">
                <div>
                  <div className="d-flex">
                    <span className="m-0 px-1">JONALYN MANGAHAS</span>
                    <span>[11-April-2025 12:55PM]</span>
                  </div>
                  <hr className="p-0 mt-1"></hr>
                </div>
                <div className="bg-light-gray p-3">
                  <div className="border p-3">
                    <small>
                      Hi, We have successfully created a database backup. Please
                      see the attached image for your reference. Thanks and
                      regards,
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
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
        <div className="modal fade" ref={modalRef} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form >
                <div className="modal-header p-1 m-0 bg-blue text-white">
                  <button
                    type="button"
                    className="btn-close fs-10 px-3"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                 <div>
                    <img src={img} className="img-fluid" />
                 </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-transparent border"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;
