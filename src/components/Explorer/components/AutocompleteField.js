import React, { useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';



const AutocompleteField = ({id, className, autocompleteResults=[], handleInputChange, placeholderText="", ...props}) => {
  return (
    <Autocomplete
      id={id}
      name={id}
      fullWidth
      freeSolo
      size="small"
      filterOptions={(x) => x}
      options={autocompleteResults}
      autoComplete
      includeInputInList
      filterSelectedOptions
      noOptionsText="No suggested results"
      onInputChange={handleInputChange}
      renderInput={(params) => <TextField {...params} placeholder={placeholderText} />}
    />
  )
}

export default AutocompleteField
