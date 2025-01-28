import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DefaultButton from './DefaultButton';

// App Language.
import { useTranslation } from 'react-i18next'

function SearchBar({ 
  classes, 
  label, 
  placeholderText, 
  searchLoading, 
  searchTerm,
  setSearchTerm,
  autocompleteResults, 
  handleSearchChange,
  handleFilterChange,
  onAutocompleteSelect,
  autocompleteValue
}) {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const handleSelect = (e) => {
    handleFilterChange({keyword: searchTerm})
  }

  return (
    <div className="relative">
      <div className={`ge-search-field-wrapper tw-flex tw-gap-2 tw-items-stretch`}>
        <Autocomplete
          id="gifts-search-bar"
          fullWidth
          style={{ maxWidth: "520px" }}
          freeSolo
          size="small"
          color="secondary"
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
          onChange={onAutocompleteSelect}
          value={autocompleteValue}
          getOptionLabel={(option) => `${option.match}`}
          autoComplete
          filterSelectedOptions
          noOptionsText={t.explorer.no_results}
          onInputChange={handleSearchChange}
          inputValue={searchTerm}
          renderInput={(params) => <TextField {...params} placeholder={placeholderText} />}
        />
        <DefaultButton onClick={handleSelect} label={t.explorer.search} />
      </div>
    </div>
  )
}

export default SearchBar
