import React, { useEffect, useRef, useState } from "react";
import { Modal as BootstrapModal } from "bootstrap";
import ModalTemp from "../components/modals/Template";
import Comments from "./Comments";

function TicketDetails({ data, formatDate}) {
  const modalRef = useRef(null);
  const [img, setimg] = useState("");

  // Show modal manually
  const openModal = (url) => {
    const modal = new BootstrapModal(modalRef.current);
    modal.show();
    setimg(url);
  };

  const closeModal = () => {
    const modal = BootstrapModal.getInstance(modalRef.current);
    if (modal) modal.hide();
  };

  useEffect(() => {
    console.log("attachments:", data.attachments);
  }, []);
  return (
    <div>
      <div className="rounded border">
        <div className="d-flex justify-between ">
          <div className="d-flex flex-wrap bg-light-gray w-100 p-2">
            <h5 className="p-0 m-0">
              <i className="fa fa-ticket px-2" aria-hidden="true"></i>
              Ticket Code:
            </h5>
            <h5 className="p-0 m-0"> {data.item?.id}</h5>
          </div>
        </div>
        <div className="py-3 px-4">
          <div className="d-flex  flex-wrap py-1">
            <span className="m-0 pe-2 p-0 fw-bold">Posted by : </span>
            <span className="">{data.item?.name} </span>
          </div>
          <div className="d-flex  flex-wrap py-1">
            <span className="m-0 pe-2 p-0 fw-bold">Date Posted : </span>
            <span className="">{formatDate(data.item?.createdAt)}</span>
          </div>
          <div className="d-flex  flex-wrap py-1">
            <span className="m-0 pe-2 p-0 fw-bold">Nature of Problem: </span>
            <span className="">{data.item?.problem} </span>
          </div>
          <div className="d-flex  flex-wrap py-1">
            <span className="m-0 pe-2 p-0 fw-bold">SAP type: </span>
            <span className="">{data.item?.sapTypes} </span>
          </div>
          <div>
            <div className=" p-0">
              <div className="py-1">
                <label htmlFor="exampleFormControlInput1" className="fw-bold">
                  Title :
                </label>
              </div>
              <div className="form-group">
                <textarea
                  className="w-100 p-2"
                  value={data.item?.title || ""}
                  disabled
                ></textarea>
              </div>
            </div>
          </div>
          <div>
            <div className=" p-0">
              <div className="py-1">
                <label htmlFor="exampleFormControlInput1" className="fw-bold">
                  Description :
                </label>
              </div>
              <div className="form-group">
                <textarea
                  className="w-100 p-2"
                  rows="3"
                  value={data.item?.description || ""}
                  disabled
                ></textarea>
              </div>
            </div>
          </div>
          <div>
            {data.attachments?.length > 0 ? (
              <label htmlFor="exampleFormControlInput1" className="fw-bold">
                Attachments :
              </label>
            ) : (
              ""
            )}

            <div className="d-flex">
              {data.attachments?.map((file) => (
                <div
                  className="w-13 border mx-1 cursor-pointer"
                  key={file.key}
                  onClick={() => {
                    openModal(file.signed_url);
                  }}
                >
                  <img src={file.signed_url} className="img-fluid" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ModalTemp modalRef={modalRef} closeModal={closeModal} size="modal-lg">
        <div className="d-flex justify-content-center">
          <img src={img} className="img-fluid" />
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
      </ModalTemp>
    </div>
  );
}

export default TicketDetails;
