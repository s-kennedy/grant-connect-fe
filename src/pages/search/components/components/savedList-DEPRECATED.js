import React, { useState, useEffect } from 'react'
import * as SearchController from '../../../../controllers/SearchController-DEPRECATED'
import { getLanguage } from 'data/locale'

const SavedList = ({ parent }) => {
  const [localSearches, setSearches] = useState([])
  const [selected, setSelected] = useState()
  const { t } = getLanguage()
  const [selectedId, setSelectedID] = useState()
  useEffect(() => {
    SearchController.getSaveSearch().then(req => {
      setSearches(req)
      window.dispatchEvent(new Event('resize'))
    })
  }, [])
  const length = localSearches.length
  return (
    <div className={'Saved-filter'}>
      <div>
        {t.search.savedSearch.title1} {15} {t.search.savedSearch.title2}
      </div>
      <div className={'Saved-filter--list'}>
        {localSearches &&
          localSearches.map((item, id) => {
            return (
              <div data-selected={selectedId === id} key={id} className={'Saved-filter--list-item'}>
                <div>{item.title}</div>
                <span
                  className={'Saved-filter--list-item--selected'}
                  data-selected={selectedId === id}
                  onClick={() => {
                    parent.setState({ selectedFilter: item })
                    setSelected(item)
                    setSelectedID(id)
                  }}
                >
                  {t.search.savedSearch.select}
                </span>
                <span
                  className={'Saved-filter--list-item--delete'}
                  onClick={() => {
                    SearchController.deleteSaveSearch(item.uri, item.title).then(() => {
                      SearchController.getSaveSearch().then(req => {
                        setSearches(req)
                        parent.setState({ selectedFilter: undefined })
                        setSelected(undefined)
                        setSelectedID(undefined)
                      })
                    })
                  }}
                >
                  {t.search.savedSearch.delete}
                </span>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default SavedList
