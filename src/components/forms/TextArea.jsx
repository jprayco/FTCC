import React from 'react'

function TextArea({name, value, getValue, placeholder}) {
  return (
    <div className="form-group">
    <textarea
      className="form-control"
      rows="3"
      value={value}
      onChange={getValue}
      placeholder={placeholder}
    ></textarea>
  </div>
  )
}

export default TextArea
