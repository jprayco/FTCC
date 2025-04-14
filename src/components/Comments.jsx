import React, { useEffect, useRef, useState } from "react";
import { Modal as BootstrapModal } from "bootstrap";
import ModalTemp from "../components/modals/Template";

function Comments({ comments, setComments }) {
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
    console.log("all commentsssss", comments);
  }, [comments]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div>
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
          {comments.item?.map((comment, index) => (
            <div className="border p-2" key={index}>
              <div>
                <div className="d-flex">
                  <span className="m-0 px-1">{comment.name} </span>
                  <span> [  {formatDate(comment.createdAt)} ] </span>
                </div>
                <hr className="p-0 mt-1"></hr>
              </div>
              <div className="bg-light-gray p-3">
                <div className="border p-3">
                  <small>{comment.comment}</small>
                </div>
              </div>

              <div className="d-flex">
                {comment.attachments?.map((file, index) => (
                  <div key={index}
                    className="w-5 border m-1 cursor-pointer d-flex align-items-center justify-content-center"
                    onClick={() => {
                      openModal(file.signed_url);
                    }}
                  >
                    <img src={file.signed_url} className="img-fluid" />
                  </div>
                ))}
              </div>

              <ModalTemp
                modalRef={modalRef}
                closeModal={closeModal}
                size="modal-lg"
              >
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default Comments;
