import React from "react";

const natureOfProblems = [
  "Add-On - BIR",
  "Add-On - COST Related Transactions",
  "Add-On - General, Inventory, Warehouse, Others",
  "Add-On - INCOME Related Transactions",
  "Additional Client Setup/Installation",
  "All COST related transactions (e.g. Purchasing A/P, Outgoing Payments)",
  "All INCOME related transactions (e.g. Sales A/R, Incoming Payments)",
  "Business Analytics BI",
  "Cloud Infrastructure",
  "General Setup (e.g Admin, BP, Inventory, BOM)",
  "License",
  "License (Production Downtime/Temporary)",
  "Performance Issue",
  "Reconciliaton Issues",
  "Report / Form Troubleshooting",
  "Reports Modification",
  "SAP B1 Client workstation access",
  "Server down (e.g zero connections, cannot find database)",
  "Technical Inquiry (e.g. Hardware Requirements)"
];

function NatureOfProblem({handleChangePost, postTicket}) {
  return (
    <div>
      <select className="form-control my-2" value={postTicket.problem} onChange={(e)=>(handleChangePost("problem",e))} required>
        <option disabled value="">
          *Select Nature of Problem*
        </option>
        {natureOfProblems.map((problem, index) => (
          <option key={index} value={problem}>{problem}</option>
        ))}
      </select>
    </div>
  );
}

export default NatureOfProblem;
