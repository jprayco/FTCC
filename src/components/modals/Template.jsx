import React from "react";

function Template({ modalRef,closeModal, title, icon, size, children }) {
  return (
    <div>
      <div className="modal fade" ref={modalRef} tabIndex="-1">
        <div className={`modal-dialog ${size}`}>
          <div className="modal-content">
            <div className="modal-header p-1 m-0 bg-blue text-white">
              <i className={icon} aria-hidden="true"></i>
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close fs-10 px-3"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Template;
