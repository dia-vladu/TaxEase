import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFile, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import './FileUpload.scss'
import axios from 'axios'
import { useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone'
import FileList from './../FileList/FileList'
import OKModal from '../OKModal/OKModal'
import { extractData } from './dataProcessing';

const FileUpload = ({ files, setFiles, removeFile, errorMessage, setError, isDisabled, setDisabled }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const adresaEmail = decodeURIComponent(searchParams.get('userEmail'));
    const [isUploading, setIsUploading] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        disabled: files.length > 0,
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            if (files.length === 0) {
                uploadHandler(acceptedFiles);
            }
        },
    });

    const uploadHandler = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) {
            return;
        } else {
            setDisabled(false);
        }
        if (file.type !== 'application/pdf') {
            setError('Only PDF documents are allowed!');
            setDisabled(true);
            return;
        }
        setError(null);
        file.isUploading = true;
        setFiles([...files, file])
        setIsUploading(true);

        // upload file
        const formData = new FormData();
        formData.append(
            "newFile",
            file,
            file.name
        )
        console.log(formData);
        console.log(file);

        axios.post('http://localhost:8080/api/files/uploadFile')
            .then((res) => {
                file.isUploading = false;
                setFiles([...files, file])
                setIsUploading(false);
                console.log(`File ${file.name} has been uploaded.`)
            })
            .catch((err) => {
                // inform the user
                console.error(err)
                removeFile(file.name)
                setIsUploading(false);
            });
    }

    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    return (
        <>
            <div className='card'>
                {errorMessage && <p className="error"><i><FontAwesomeIcon icon={faExclamationCircle} /></i>{errorMessage}</p>}
                <div className={`file-card${files.length > 0 ? ' disabled' : ''}`} {...getRootProps()}>

                    <div className="file-inputs">
                        <i><FontAwesomeIcon icon={faFile} /></i>
                        <input type="file" id='inpFile' {...getInputProps()} disabled={files.length > 0} />
                    </div>
                    <p className="main"><span className="drag-drop">Drag and Drop</span> here</p>
                    <p className="info">or click to select file</p>
                    <FileList files={files} removeFile={removeFile} />
                </div>
                <button
                    type='button'
                    disabled={isDisabled || isUploading}
                    onClick={async () => {
                        if (!isUploading) {
                            try {
                                const extractionSuccess = await extractData(files);
                                if (!extractionSuccess) {
                                    throw new Error("Data extraction failed.");
                                }
                                toggleModal();
                                setFiles([]);
                                setDisabled(true);
                                const emailResponse = await fetch(`http://localhost:8080/api/emails/enroll`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ userEmail: adresaEmail }),
                                });

                                if (!emailResponse.ok) {
                                    throw new Error(`Email request failed: ${emailResponse.statusText}`);
                                }
                            } catch (err) {
                                setError(err.message);
                                console.error(err);
                            }
                        }
                    }}>
                    <i><FontAwesomeIcon icon={faPlus} /></i>
                    Upload
                </button>
            </div>
            {showModal && (<OKModal toggleModal={toggleModal} />)}
        </>
    )
}

export default FileUpload