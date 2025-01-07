import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';


const SimpleInputField = ({type="text", id, className, label, ...props}) => {
  return (
    <div className="tw-flex tw-flex-col tw-mb-2">
      {label && <label htmlFor={id} className="tw-mb-1">{label}</label>}
      <TextField 
        id={id}
        name={id}
        type={type}
        className="ge-simple-text-field" 
      />
    </div>
  )
}

export default SimpleInputField
