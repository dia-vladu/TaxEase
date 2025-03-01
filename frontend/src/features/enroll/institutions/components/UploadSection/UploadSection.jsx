import React from 'react'
import { useState } from 'react';
import './UploadSection.scss'
import FileUpload from './../FileUpload/FileUpload';

const UploadSection = ({mail}) => {
  const [files, setFiles] = useState([])
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDisabled, setDisabled] = useState(true);

  const removeFile = (filename) => {
    setFiles(files.filter(file => file.name !== filename))
    setErrorMessage(null)
    setDisabled(true)
  }

  const setError = (msg) => {
    setErrorMessage(msg);
  }

  const disable = (bool) => {
    setDisabled(bool)
  }

  return (
    <div className='uploadSection'>
      <h2>Upload Enrollment Form</h2>
      <FileUpload files={files} setFiles={setFiles} removeFile={removeFile} errorMessage={errorMessage} setError={setError}
        isDisabled={isDisabled} setDisabled={disable} />
    </div>
  )
}

export default UploadSection