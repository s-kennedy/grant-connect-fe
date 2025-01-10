import React, { useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


const AutocompleteField = ({id, className, options, onInputChange, placeholderText="", ...props}) => {
  console.log({options})
  return (
    <div className="relative">
    <Autocomplete
      id={id}
      fullWidth
      freeSolo
      size="small"
      options={options}
      noOptionsText="No suggested results"
      onInputChange={onInputChange}
      // inputValue={searchTerm}
      renderInput={(params) => <TextField {...params} placeholder={placeholderText} />}
      {...props}
    />
    </div>
  )
}

export default AutocompleteField
