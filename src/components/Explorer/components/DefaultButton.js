import { FlatButton } from 'material-ui'

const DefaultButton = ({className="", label, ...props}) => {
  return (
    <FlatButton 
      label={label} 
      variant="contained" 
      className={`button-primary ${className}`} 
      {...props}
    />
  )
}

export default DefaultButton
