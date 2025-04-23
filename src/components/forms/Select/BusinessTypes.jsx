import React, { useEffect, useState } from "react";

const sapTypes = [
  "Accounting",
  "Advertising/Marketing/PR",
  "Aerospace & Defense",
  "Agriculture",
  "Banking & Securities",
  "Call Center Outsourcing",
  "Consulting",
  "Consumer Products",
  "Education",
  "Energy, Chemical, Utilities",
  "Financial Services - Other",
  "Government - Federal",
  "Government - State & Local",
  "High Tech - Hardware",
  "High Tech - ISP",
  "High Tech - Other",
  "Hospital, Clinic, Doctor Office",
  "Hospitality, Travel, Tourism",
  "Insurance",
  "Legal",
  "Manufacturing",
  "Medical, Pharma, Biotech",
  "Real Estate",
  "Retail",
  "Software - Finance",
  "Software - Healthcare",
  "Software - Other",
  "Support Outsourcing",
  "Telecommunications",
  "Transportation & Distribution",
  "VAR/Systems Integrator",
  "Others",
];

function BusinessTypes({ handleChangePost, postTicket }) {
  const [seletedValue, setSeletedValue] = useState("")
  const [isOther, setOther] = useState(false)
  const [value, setValue] = useState("")

  useEffect(()=>{
    console.log(seletedValue)
    if(seletedValue === "Others"){
      setOther(true)
    }else{
      setOther(false)
    }
  },[seletedValue])

  const getValue = (field, e)=>{
    handleChangePost(field, e)
    setSeletedValue(e.target.value)
  }

  const getOther = (field,e)=>{
    setValue(e.target.value)
    handleChangePost(field, e)
  }

  return (
    <div>
      <div className="form-group ">
        <div className="form-control p-0 row bg-light-gray mx-0 my-2">
          <label
            htmlFor="exampleFormControlInput1"
            className="bg-light-gray py-1 px-3 col-4"
          >
            Industry :
          </label>
          <select
            className="border p-1 col-8"
            onChange={(e) => getValue("businessType", e)}
            value={seletedValue}
            required
          >
            <option disabled value="">
              *Select Industry*
            </option>
            {sapTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isOther ? (
        <div className="form-control p-0 row bg-light-gray mx-0 my-2">
          <label
            htmlFor="exampleFormControlInput1"
            className="bg-light-gray py-1 px-3 col-4"
          >
            Please specify :
          </label>
          <input
            type="text"
            className="border p-1 col-8"
            placeholder=""
            required={true}
            value={value}
          onChange={(e) => getOther("businessType", e)}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default BusinessTypes;
