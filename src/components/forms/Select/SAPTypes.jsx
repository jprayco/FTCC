import React from "react";

const sapTypes = [
"SAP Advanced Data Migration (ADP)",
  "SAP Advanced Planner and Optimizer",
    "SAP Analytics Cloud (SAC)",
  "SAP Advanced Business Application Programming (ABAP)",
"SAP Apparel and Footwear Solution (AFS)",
    "SAP Business Information Warehouse (BW)",
    "SAP Business ByDesign (ByD)",
    "SAP Business Explorer (Bex)",
    "SAP BusinessObjects Lumira",
    "SAP BusinessObjects Web Intelligence (Webi)",
    "SAP Business One",
    "SAP Business Partner Screening",
    "SAP Business Intelligence (BI)",
    "SAP Business Workflow",
    "SAP Catalog Content Management ",
    "SAP Cloud for Customer (C4C)",
    "SAP Cost Center Accounting (CCA)",
    "SAP Convergent Charging (CC)",
    "SAP Converged Cloud",
   "SAP Data Warehouse Cloud (DWC)",
    "SAP Design Studio",
    "SAP PRD2(P2)",
    "SAP Enterprise Buyer Professional (EBP)",
    "SAP Enterprise Learning",
    "SAP Portal (EP)",
    "SAP Exchange Infrastructure (XI)" ,
    "SAP Extended Warehouse Management (EWM)",
    "SAP FICO",
    "SAP BPC (Business Planning and Consolidation, formerly OutlookSoft)",
    "SAP GRC (Governance, Risk and Compliance)",
    "SAP EHSM (Environment Health & Safety Management)",
    "Enterprise Central Component (ECC)",
    "SAP ERP",
    "SAP HANA",
    "SAP Human Resource Management Systems (HRMS)",
    "SAP SuccessFactors",
    "SAP Information Design Tool (IDT)",
    "SAP Integrated Business Planning (IBP)",
    "SAP Internet Transaction Server (ITS)",
    "SAP Incentive and Commission Management (ICM)",
    "SAP IT Operations Analytics (ITOA)",
    "SAP Jam",
    "SAP Knowledge Warehouse (KW)",
    "SAP Manufacturing",
    "SAP Marketing Cloud",
    "SAP Materials Management (MM)",
    "SAP Master Data Management (MDM)",
    "SAP Plant Maintenance (PM)",
    "SAP Product Lifecycle Costing (PLC)",
    "SAP Profitability and Cost Management (PCM)",
    "SAP Project System (PS)",
    "SAP Rapid Deployment Solutions (RDS)",
    "SAP Service and Asset Management",
    "SAP Supply Network Collaboration (SNC)",
    "SAP Solutions for mobile business",
    "SAP Sales and Distribution (SD)",
    "SAP Solution Composer",
    "SAP Strategic Enterprise Management (SEM)",
    "SAP Test Data Migration Server (TDMS)",
    "SAP Training and Event Management (TEM)",
    "SAP Transportation Management (TM)",
    "SAP NetWeaver Application Server (Web AS)",
    "SAP xApps",
    "SAP Sales Cloud (previously: CallidusCloud)",
   "SAP Supply Chain Performance Management (SCPM)",
   "SAP Supply Chain Management (SCM)",
    "SAP Sustainability Performance Management (SUPM)",
    "SAP S/4HANA",
    "SAP Master Data Governance (MDG)",
    "SAP S/4HANA Cloud"
    

];

function SAPTypes({handleChangePost, postTicket}) {
  return (
    <div>
      <select className="form-control" onChange={(e)=>(handleChangePost("sapTypes", e))} value={postTicket.sapTypes} required>
        <option disabled value="">
          *Select SAP Type*
        </option>
        {sapTypes.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SAPTypes;
