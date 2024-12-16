import PropTypes from 'prop-types'

import FromToFilter from '../../pages/search/components/filters/FromToFilter'

import LanguageSelect from 'components/LanguageSelect'
import OpenToRequestsSelect from 'components/OpenToRequestsSelect'
import SortBySelect from 'components/SortBySelect'
import { useDispatch, useSelector } from 'react-redux'
import { setFilterByKey } from 'store/actions/filters'
import { selectAllFilters } from 'store/selectors/filters'
import { debouncedTrackFunderSearchFilter, trackFunderSearchFilter, trackFunderSearchSortBy } from 'utils/mixpanel'
import { useTranslation } from 'react-i18next'

const Filters = ({ language, openToRequests, sortBy, onChange, showOnlySortBy, hideSortBy }) => {
  const dispatch = useDispatch()
  const { medianGiftMin, medianGiftMax } = useSelector(selectAllFilters)

  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const handleChange = async ({ key, value }) => {
    onChange({ key, value })

    if (key === 'sortBy') {
      await trackFunderSearchSortBy(value)
    } else {
      await trackFunderSearchFilter({ filter: key, value })
    }
  }

  if (showOnlySortBy) {
    return (
      <SortBySelect
        value={sortBy}
        onChange={(_, __, value) => handleChange({ key: 'sortBy', value })}
      />
    )
  }

  return (
    <div className="Search-page__filters">
      <LanguageSelect
        value={language}
        onChange={(_, __, value) => handleChange({ key: 'language', value })}
      />

      <OpenToRequestsSelect
        value={openToRequests}
        onChange={(_, __, value) => handleChange({ key: 'openToRequests', value })}
      />

      <FromToFilter
        page="Search"
        field="typical"
        fromLabel={t.cards.typicalGift}
        toLabel=" "
        fromValue={medianGiftMin}
        toValue={medianGiftMax}
        showActions={false}
        /* showClear={true} */
        onChange={async ({ target: { value } }, type) => {
            dispatch(
              setFilterByKey({
                [type]: value
              })
            )
            await debouncedTrackFunderSearchFilter({ filter: type, value })
          }
        }
        onSubmit={() => console.log('hello')}
        /* onCancel={() => console.log('clear median ')} */
      />

      {!hideSortBy && (
        <SortBySelect
          value={sortBy}
          onChange={(_, __, value) => handleChange({ key: 'sortBy', value })}
        />
      )}
    </div>
  )
}

Filters.propTypes = {
  language: PropTypes.string.isRequired,
  openToRequests: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  showOnlySortBy: PropTypes.bool.isRequired,
  hideSortBy: PropTypes.bool.isRequired
}

export default Filters
