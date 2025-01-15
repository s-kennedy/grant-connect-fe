import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, IconButton } from 'material-ui'
import { Search, Check, UnfoldMore } from 'material-ui-icons'

const FunderCell = ({cell}) => {
  const [showModal, setShowModal] = useState(false)
  
  
  const handleClose = () => {
    setShowModal(false)
  }

  const handleOpen = (e) => {
    setShowModal(true)
  }

  const inPipeline = cell.row.original.funder.pipeline
  return (
    <div>
      <div className="ge-table-cell tw-inline-flex tw-gap-1">
        {cell.getValue()}
        <IconButton className="ge-icon-button" onClick={handleOpen}><div className="tw-rotate-45"><UnfoldMore /></div></IconButton>
        {inPipeline && <IconButton className="ge-icon-button ge-pipeline-button"><Check /></IconButton> }
      </div>
      <Dialog
        open={showModal}
        onClose={handleClose}
        onRequestClose={handleClose}
        onBackdropClick={handleClose}
        className="Explorer"
      >
        <div className="tw-mb-5">
          <p className="tw-w-full tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">{cell.getValue()}</p>
        </div>
      </Dialog>
    </div>
  )
}

export default FunderCell
