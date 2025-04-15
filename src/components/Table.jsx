import React from "react";

function Table({ children }) {
  return (
    <div>
      <table className="table table-container">
        <thead className="">
          <tr className="">
            <th scope="col" className="p-0 m-0">
              <div className="bg-blue text-white d-flex justify-content-center p-3">
                Title
              </div>
            </th>
            <th scope="col" className="p-0 m-0">
              <div className="bg-blue text-white d-flex justify-content-center p-3">
                Description
              </div>
            </th>
            <th scope="col" className="p-0 m-0">
              <div className="bg-blue text-white d-flex justify-content-center p-3">
                Nature of Problem
              </div>
            </th>
            <th scope="col" className="p-0 m-0">
              <div className="bg-blue text-white d-flex justify-content-center p-3">
                SAP Type
              </div>
            </th>
            <th scope="col" className="p-0 m-0">
              <div className="bg-blue text-white d-flex justify-content-center p-3">
                Date Posted
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
