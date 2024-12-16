import React, { useState } from 'react'
import { get } from 'lodash'
import { getLanguage } from 'data/locale'

const SaveSearch = ({ parent }) => {
  // parent.setState()
  const [name, setName] = useState(get(parent.state.nameSaveSearch, ''))
  const { t } = getLanguage()
  return (
    <div className={'Save-search'}>
      {t.search.saveSearch.title}
      <div>
        <input
          placeholder={t.search.saveSearch.placeholder}
          className={'Save-search--input'}
          type={'text'}
          maxLength={50}
          minLength={2}
          defaultValue={name}
          onChange={e => {
            setName(e.target.value)
            parent.setState({ nameSaveSearch: e.target.value })
          }}
        />
      </div>
    </div>
  )
}

export default SaveSearch
