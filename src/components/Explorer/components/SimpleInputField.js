import TextField from '@mui/material/TextField';

const SimpleInputField = ({type="text", id, className, label, placeholder, errorMessage, ...props}) => {
  return (
    <div className="tw-flex tw-flex-col tw-mb-2">
      {label && <label htmlFor={id} className="tw-mb-1">{label}</label>}
      <TextField 
        id={id}
        name={id}
        type={type}
        className="ge-simple-input-field"
        placeholder={placeholder} 
        error={!!errorMessage}
        helperText={errorMessage}
        {...props}
      />
    </div>
  )
}

export default SimpleInputField
