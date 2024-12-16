import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, FlatButton, IconButton, Menu, MenuItem, Popover } from 'material-ui'
import { useTranslation } from 'react-i18next'

import { addToPipeline, updatePipelineItem } from 'store/actions/pipeline'
import { selectPipelineStages } from 'store/selectors/pipelineStages'
import { trackAddFunderToPipeline, trackChangeFunderPipelineStage } from 'utils/mixpanel'
import { Close, KeyboardArrowDown } from 'material-ui-icons'

const PipelineStageButton = ({ buttonClass, spinnerColor, opportunity, funderId, loadData }) => {
  const dispatch = useDispatch()
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const [isProcessing, setIsProcessing] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState()

  const {
    results: pipelineStages,
  } = useSelector(selectPipelineStages)

  if (!pipelineStages) return null

  const minOrder = Math.min(...pipelineStages.map(item => item.order));
  const firstPipelineStage = pipelineStages.find(item => item.order === minOrder)

  const handleOpen = ({currentTarget}) => {
    setIsDropdownOpen(true)
    setAnchorEl(currentTarget)
  }

  const handleAddToPipeline = async () => {
    setIsProcessing(true)
    if (opportunity) {
      await dispatch(updatePipelineItem(firstPipelineStage.id, opportunity.id))
    } else {
      await dispatch(addToPipeline(funderId, firstPipelineStage.id))
    }
    await dispatch(loadData())
    setIsProcessing(false)

    await trackAddFunderToPipeline(funderId)
  }

  const handleChangePipelineStage = async (stageId) => {
    setIsDropdownOpen(false)
    setIsProcessing(true)
    await dispatch(updatePipelineItem(stageId, opportunity.id))
    await dispatch(loadData())
    setIsProcessing(false)

    const prevStageId = opportunity.pipelineStage && opportunity.pipelineStage.id || opportunity.pipelineStage
    await trackChangeFunderPipelineStage({ funderId, prevStageId, stageId })
  }

  if (opportunity && opportunity.hidden) {
    return (
      <div className="Material-cards-stages-wrapper">
        <FlatButton className={`${buttonClass} add`} label={t.pipeline.hidden} disabled={true} />
      </div>
    )
  }

  if (!opportunity || !opportunity.pipelineStage) {
    const buttonProps = {
      className: `${buttonClass} add`,
      label: t.pipeline.addToPipeline,
      onClick: isProcessing ? () => null : handleAddToPipeline,
      ...(isProcessing ? {
        labelPosition: 'before',
        icon: <CircularProgress size={20} color={spinnerColor} />
      } : null)
    }
    return (
      <div className="Material-cards-stages-wrapper">
        <FlatButton {...buttonProps}/>
      </div>
    )
  }

  const stageId = opportunity.pipelineStage && opportunity.pipelineStage.id || opportunity.pipelineStage

  return (
    <div className="Material-cards-stages-wrapper">
      <FlatButton
        className={`${buttonClass}`}
        label={pipelineStages.find(item => item.id === stageId).name}
        labelPosition="before"
        icon={isProcessing ? <CircularProgress size={20} color="#479cff" /> : <KeyboardArrowDown />}
        onClick={isProcessing ? () => null : handleOpen}
      />
      <Popover
        open={isDropdownOpen}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <Menu className="Material-cards__expanded-stages-menu-wrapper">
          <IconButton onClick={() => setIsDropdownOpen(false)}>
            <Close />
          </IconButton>
          {pipelineStages
            .sort((a, b) => a.order - b.order)
            .map((stage) => {
            return (
              <MenuItem
                key={stage.id}
                className="Material-cards__expanded-stages-item"
                primaryText={stage.name}
                onClick={() => handleChangePipelineStage(stage.id)}
              />
            )
          })}
        </Menu>
      </Popover>
    </div>
  )
}

export default PipelineStageButton
