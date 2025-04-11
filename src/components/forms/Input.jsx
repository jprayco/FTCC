import React from "react";

function Input({name, value, getValue, type}) {
  return (
    <div className="form-group">
      <label htmlFor="exampleFormControlInput1">{name}</label>
      <input type={type} className="form-control" placeholder="" required value={value} onChange={getValue} />
    </div>
  );
}

export default Input;
