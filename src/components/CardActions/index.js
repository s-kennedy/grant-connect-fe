import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IconButton, Menu, Popover } from 'material-ui'
import { Close, MoreVert } from 'material-ui-icons'
import _ from 'lodash'

import { selectIsLibraryMode } from 'store/selectors/user'

const CardActions = ({ funder, opportunityId, actions = [], loadData }) => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState()
  const [Dialog, setDialog] = useState()

  const isLibraryMode = useSelector(selectIsLibraryMode)

  const handleOpen = ({currentTarget}) => {
    setIsOpen(true)
    setAnchorEl(currentTarget)
  }

  if (!actions.length) return null
  if (isLibraryMode) return null

  return (
    <div className="Material-cards-actions-wrapper">
      <IconButton className="Material-cards__expanded-actions" onClick={handleOpen}>
        <MoreVert />
      </IconButton>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        onRequestClose={() => setIsOpen(false)}
      >
        <Menu className="Material-cards__expanded-actions-menu-wrapper">
          <IconButton onClick={() => setIsOpen(false)}>
            <Close />
          </IconButton>
          
          {actions.filter(item => item).map((Action, index) => (
            <Action
              key={index}
              funder={funder}
              opportunityId={opportunityId}
              setShowDialog={dialog => {
                setIsOpen(false)
                setDialog(() => dialog)
              }}
              loadData={loadData}
              dispatch={dispatch}
            />
          ))}
        </Menu>
      </Popover>
      {!!Dialog && Dialog}
    </div>
  )
}

export default CardActions
