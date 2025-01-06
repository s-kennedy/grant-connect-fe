import React, { useState, useEffect } from 'react'
import { Loop } from 'material-ui-icons'
import { Dialog, FlatButton, TextField } from 'material-ui'


const SimpleInputField = ({type="text", id, className, label, ...props}) => {
  return (
    <div className="tw-flex tw-flex-col tw-mb-2">
      {label && <label htmlFor={id} className="tw-mb-1">{label}</label>}
      <input 
        id={id}
        name={id}
        type={type}
        className="ge-simple-text-field tw-bg-white tw-border tw-border-solid tw-border-grey tw-rounded-sm tw-p-2" 
      />
    </div>
  )
}

export default SimpleInputField
