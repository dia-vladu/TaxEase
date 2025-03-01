import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollar } from '@fortawesome/free-solid-svg-icons'
import './Institutie.scss'

const Institutie = ({ institutie }) => {
    return (
        <>
            <li
                className="file-item"
                key={institutie.name}>
                <FontAwesomeIcon icon={faDollar} />
                <p>{institutie.name}</p>
            </li>
        </>
    )
}

export default Institutie