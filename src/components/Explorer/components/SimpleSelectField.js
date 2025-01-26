import Select from 'react-select'

const SimpleSelectField = ({options=[], id, className, label, placeholder, errorMessage, defaultValue, value, ...props}) => {
  return (
    <div className="tw-flex tw-flex-col tw-mb-2">
      {label && <label htmlFor={id} className="tw-mb-1">{label}</label>}
      <select 
        name={id} 
        className={`ge-simple-select-field ${className}`}
        value={value || defaultValue}
        {...props}
      >
        {
          options.map(opt => {
            return <option key={opt.value} value={opt.value}>{opt.label}</option>
          })
        }
      </select>
    </div>
  )
}

export default SimpleSelectField
