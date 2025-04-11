import React, { useRef, useState } from 'react';

function AttachFile({selectedFiles, setSelectedFiles}) {
    const fileInputRef = useRef(null);
  
    const handleButtonClick = () => {
      fileInputRef.current.click();
    };
  
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
      
        const filteredNewFiles = newFiles.filter(
          (newFile) => !selectedFiles.some((f) => f.name === newFile.name)
        );
      
        const totalFiles = [...selectedFiles, ...filteredNewFiles];
      
        if (totalFiles.length > 3) {
          alert("Maximum of 3 attachments.");
          return;
        }
      
        setSelectedFiles(totalFiles);
      };
      
  
    return (
      <div className="d-flex">
        <div className="">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            name="files"
            accept=".pdf, .jpg, .jpeg, .png"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            multiple
          />
  
          {/* Attach File Button */}
          <button
            type="button"
            className="btn-blue col-auto me-2"
            onClick={handleButtonClick}
          >
            ATTACH FILE
          </button>
  
          {/* File Tags */}
          <div className="col d-flex flex-wrap mt-2">
            {selectedFiles.map((file, idx) => (
              <small key={idx} className=" bg-light border text-dark me-2 mb-1 p-1">
                {file.name}
              </small>
            ))}
          </div>
        </div>
      </div>
    );
}

export default AttachFile
