import { FlatButton } from 'material-ui'

const ButtonWithIcon = ({className="", label, color, Icon, ...props}) => {
  return (
    <FlatButton className={`ge-button ${color} ${className}`} {...props}>
      <div className="tw-inline-flex tw-p-1 tw-items-center tw-text-dark">
        <Icon />
        <span className="tw-ml-1">{label}</span>
      </div>
    </FlatButton>
  )
}

export default ButtonWithIcon
