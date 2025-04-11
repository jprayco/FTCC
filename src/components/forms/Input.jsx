import React from "react";

function Input({ name, value, getValue, type, placeholder }) {
  return (
    <div className="form-group ">
      <div className="form-control p-0 row bg-light-gray mx-0 my-2">
        <label
          htmlFor="exampleFormControlInput1"
          className="bg-light-gray py-1 px-3 col-4"
        >
          {name}
        </label>
        <input
          type={type}
          className="border p-1 col-8"
          placeholder={placeholder}
          required
          value={value}
          onChange={getValue}
        />
      </div>
    </div>
  );
}

export default Input;
