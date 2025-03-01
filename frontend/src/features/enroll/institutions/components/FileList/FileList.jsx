import axios from 'axios'
import React from 'react'
import FileItem from './../FileItem/FileItem'
import './FileList.scss'

const FileList = ({ files, removeFile }) => {
    const deleteFileHandler = (_name) => {
        axios.delete(`http://localhost:8080/api/files/uploadFile?name=${_name}`)
            .then((res) => {
                removeFile(_name)
            })
            .catch((err) => console.error(err));
    }
    return (
        <ul className="file-list">
            {
                files &&
                files.map(f => (<FileItem
                    key={f.name}
                    file={f}
                    deleteFile={deleteFileHandler} />))
            }
        </ul>
    )
}

export default FileList
