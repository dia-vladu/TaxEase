import React from 'react'
import Institutie from '../Institutie/Institutie'
import './InstitutiiList.scss'

const InstitutiiList = ({ institutii }) => {
  return (
    <div className='lista'>
      <ul className="listaInstitutii">
        {institutii && institutii.map(f => (<Institutie key={f.name} />))}
      </ul>
    </div>
  )
}

export default InstitutiiList