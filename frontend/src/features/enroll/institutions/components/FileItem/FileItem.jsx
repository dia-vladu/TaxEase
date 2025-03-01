import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import './FileItem.scss'

const FileItem = ({ file, deleteFile }) => {
    return (
        <>
            <li
                className="file-item"
                key={file.name}>
                <FontAwesomeIcon icon={faFileAlt} id='file-item-icon'/>
                <p>{file.name}</p>
                <div className="actions">
                    {file.isUploading ? (
                        <FontAwesomeIcon
                            icon={faSpinner}
                            className={`fa-spin ${file.isUploading ? 'disabled' : ''}`}
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faTrash}
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteFile(file.name);
                            }}
                        />
                    )}
                </div>
            </li>
        </>
    )
}

export default FileItem
