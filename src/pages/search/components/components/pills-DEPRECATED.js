import React from 'react'
import { Chip } from 'material-ui'
import _ from 'lodash'
import { Close } from 'material-ui-icons'

const Pills = ({ items, handleSearchFacetClick }) => {
  return (
    <div className={'profile-tags-list'}>
      {_.map(items, (elem, i) => {
        let label = _.get(elem, 'data.label') ? elem.data.label : _.get(elem, 'data.values.value', false)
        label = label ? label.split('(')[0] : false
        const prepareObject = label
          ? [_.get(elem, 'data.id') ? elem.data.id : elem.data.values.id, _.get(elem, 'data.url'), elem.name, true]
          : false
        return (
          <React.Fragment>
            {label && (
              <Chip
                key={i}
                onClick={() => {
                  handleSearchFacetClick(...prepareObject)
                }}
              >
                <div className={'pill-content'}>
                  {label}{' '}
                  <div className={'rounded-icon'}>
                    <Close />
                  </div>
                </div>
              </Chip>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default Pills
