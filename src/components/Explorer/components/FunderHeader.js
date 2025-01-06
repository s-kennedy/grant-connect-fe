import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton } from 'material-ui'

const FunderHeader = ({column}) => {

  return (
    <div>{column.columnDef.header}</div>
  )
}

export default FunderHeader
