import React, { useState } from 'react'
import { Dialog, FlatButton, Checkbox, ListItem } from 'material-ui'
import { FilterList } from 'material-ui-icons'
import { useTranslation } from 'react-i18next'
import causes from 'data/ge-data/causes.json'
import DefaultButton from './DefaultButton'

const FocusHeader = ({column, handleFilterChange, filters}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const currentValue = filters["focus"]?.split(",").map(n => parseInt(n))
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(currentValue || [])

  const isActive = !!filters["focus"]

  
  const handleClose = () => {
    setShowForm(false)
  }

  const handleOpen = (e) => {
    e.stopPropagation()
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    handleFilterChange({focus: selected})
    handleClose()
  }

  return (
    <div>
      <FlatButton title="Gift recipient focus" onClick={handleOpen} className={`ge-header-button ${isActive ? 'active' : ''}`}>
        <div className="tw-inline-flex tw-items-center tw-text-dark">
          <FilterList />
          <span className="tw-ml-1">{column.columnDef.header}</span>
        </div>
      </FlatButton>
      <Dialog
        open={showForm}
        onClose={handleClose}
        onRequestClose={handleClose}
        onBackdropClick={handleClose}
        className="Explorer ge-dialog"
      >
        <div className="tw-relative tw-flex tw-flex-col tw-w-full">
            <p className="tw-w-full tw-flex-none tw-tw-block tw-mb-2 tw-text-md tw-text-black tw-font-semibold">{t.explorer.filter_by_focus}</p>
            <div className="tw-overflow-scroll tw-grow">
              { causes.map(cause => {
                const selectedId = selected.findIndex(s => s === cause.id)
                const isSelected = selectedId >= 0
                return (
                  <ListItem
                    key={cause.id}
                    nestedLevel={0}
                    primaryText={cause.name}
                    primaryTogglesNestedList={false}
                    leftCheckbox={
                      <Checkbox
                        className={`ge-focus-checkbox ${isSelected ? 'active' : ''}`}
                        checked={isSelected}
                        onCheck={() => {
                          if (isSelected) {
                            const newArray = [...selected]
                            newArray.splice(selectedId, 1)
                            setSelected(newArray)
                          } else {
                            setSelected([...selected, cause.id])
                          }
                        }}
                      />
                    }
                  />
                )
              })}
            </div>
            <div className="tw-pt-3 tw-flex tw-justify-end tw-flex-none tw-border tw-border-b-0 tw-border-r-0 tw-border-l-0 tw-border-solid tw-border-grey">
              <DefaultButton onClick={handleSubmit} label={t.explorer.apply} />
            </div>
        </div>
      </Dialog>
    </div>
  )
}

export default FocusHeader
