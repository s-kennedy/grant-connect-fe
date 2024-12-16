import React, { useState } from 'react'
import { Dialog, FlatButton } from 'material-ui'

const FullTextModal = ({ fullText }) => {
  const [open, setOpen] = useState(false)

  const truncatedText = fullText.substring(0, 45)
  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)

  return (
    <>
      <div className="full-text-modal">
        <span>{truncatedText}</span>
        <FlatButton
          onClick={handleOpen}
          className="show-modal-button"
          style={{ minWidth: '14px', height: '14px', lineHeight: '14px' }}
        >
          ...
        </FlatButton>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        onRequestClose={handleClose}
        onBackdropClick={handleClose}
      >
        {fullText}
      </Dialog>
    </>
  )
}

export default FullTextModal
