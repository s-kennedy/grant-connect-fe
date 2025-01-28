import { Loop } from 'material-ui-icons'

const Loader = ({loading, className}) => {
  return (
      <Loop style={{ height: "32px", width: "32px" }} className="spin-reverse" />
  )
}

export default Loader
