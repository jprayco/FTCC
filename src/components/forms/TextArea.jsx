import React from 'react'

function TextArea({name, value, getValue, placeholder, isRequired}) {
  return (
    <div className="form-group">
    <textarea
      className="form-control"
      rows="3"
      value={value}
      onChange={getValue}
      placeholder={placeholder}
      required={isRequired}
    ></textarea>
  </div>
  )
}

export default TextArea
