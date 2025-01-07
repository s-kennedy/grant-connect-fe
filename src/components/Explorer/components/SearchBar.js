// Global DOM Components.
import React, { useState, useEffect } from 'react'
import { FlatButton } from 'material-ui'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


// App Language.
import { useTranslation } from 'react-i18next'

function SearchBar({ 
  classes, 
  label, 
  placeholderText, 
  onChange, 
  searchLoading, 
  searchTerm,
  setSearchTerm,
  autocompleteResults, 
  handleSearchChange
}) {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  return (
    <div className="relative">
      <div className={`ge-search-field-wrapper tw-flex tw-gap-2 tw-items-stretch`}>
        <Autocomplete
          id="gifts-search-bar"
          fullWidth
          freeSolo
          size="small"
          filterOptions={(x) => x}
          options={autocompleteResults}
          renderOption={(props, option) => {
            const { key, id, ...optionProps } = props;            
            return (
              <li key={id} {...optionProps} className="tw-flex tw-gap-1 tw-p-2 tw-pl-3 hover:tw-bg-lighterGrey">
                <span className="tw-text-darkGrey">{`${option.field}:`}</span>
                <span>{option.match}</span>
              </li>
            );
          }}
          getOptionLabel={(option) => `${option.match}`}
          autoComplete
          includeInputInList
          filterSelectedOptions
          noOptionsText="No suggested results"
          onInputChange={handleSearchChange}
          renderInput={(params) => <TextField {...params} placeholder={placeholderText} />}
        />
        <FlatButton label="Search" variant="contained" color="primary" className={`button-primary`} />
      </div>
    </div>
  )
}

export default SearchBar
