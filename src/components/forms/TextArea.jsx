import React from 'react'

function TextArea({name, value, getValue}) {
  return (
    <div className="form-group">
    <label htmlFor="exampleFormControlTextarea1">{name} </label>
    <textarea
      className="form-control"
      rows="3"
      value={value}
      onChange={getValue}
    ></textarea>
  </div>
  )
}

export default TextArea
