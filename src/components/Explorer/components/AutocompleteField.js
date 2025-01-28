import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next'


const AutocompleteField = ({id, className, options, onInputChange, placeholderText="", ...props}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  return (
    <div className="relative">
    <Autocomplete
      id={id}
      fullWidth
      freeSolo
      size="small"
      options={options}
      noOptionsText={t.explorer.no_results}
      onInputChange={onInputChange}
      renderInput={(params) => <TextField {...params} placeholder={placeholderText} />}
      {...props}
    />
    </div>
  )
}

export default AutocompleteField
