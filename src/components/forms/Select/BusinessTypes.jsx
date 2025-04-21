import React from 'react'

const sapTypes = [
    "Corporation",
    "Hybrid Business",
    "International sector",
    "Limited Liability Company",
    "Manufacturing",
    "Merchandising business",
    "Nonprofit Organization",
    "Organization",
    "Partnership",
    "Private Sector",
    "Public Sector",
    "Service Business",
    "Sole Proprietiorship",
    "Technology"
    ];

function BusinessTypes({handleChangePost, postTicket}) {
    return (
        <div>
          <select className="form-control" onChange={(e)=>(handleChangePost("businessType", e))} value={postTicket.businessType} required>
            <option disabled value="">
              *Select Nature of Business*
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

export default BusinessTypes
