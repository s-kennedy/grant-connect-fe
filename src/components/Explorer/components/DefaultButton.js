import React, { useState, useEffect } from 'react'
import { FlatButton } from 'material-ui'


const DefaultButton = ({className="", label, ...props}) => {
  return (
    <FlatButton 
      label={label} 
      variant="contained" 
      className={`button-primary ${className}`} 
    />
  )
}

export default DefaultButton
