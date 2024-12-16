import { FlatButton, List } from 'material-ui'
import { useDispatch, useSelector } from 'react-redux'
import { resetFacetFiltersAndReload } from 'store/actions/filters'
import {
  selectCategories,
  selectCauses,
  selectInternationals,
  selectPopulations,
  selectRegions,
  selectSupports,
  selectHeadquarters
} from 'store/selectors/facets'
import FacetsListItem from './FacetsListItem'
import { useTranslation } from 'react-i18next'

const Facets = () => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const dispatch = useDispatch()

  const facetCauses = useSelector(selectCauses)
  const facetRegions = useSelector(selectRegions)
  const facetInternationals = useSelector(selectInternationals)
  const facetPopulations = useSelector(selectPopulations)
  const facetSupports = useSelector(selectSupports)
  const facetCategories = useSelector(selectCategories)
  const facetHeadquarters = useSelector(selectHeadquarters)

  const onReset = () => {
    dispatch(resetFacetFiltersAndReload())
  }

  return (
    <div className="Search-page__facets">
      <p>
        <small>{t.search.filters}</small>
        <FlatButton onClick={onReset} label={t.global.reset} />
      </p>
      <hr />

      <div>
        <List>
          <FacetsListItem facetType="causes" name={t.facets.cause} items={facetCauses} />

          <FacetsListItem facetType="regions" name={t.facets.region} items={facetRegions} />

          <FacetsListItem
            facetType="internationals"
            name={t.facets.international}
            items={facetInternationals}
          />

          <FacetsListItem
            facetType="populations"
            name={t.facets.population}
            items={facetPopulations}
          />

          <FacetsListItem facetType="supports" name={t.facets.type_support} items={facetSupports} />

          <FacetsListItem facetType="categories" name={t.facets.industry} items={facetCategories} />

          <FacetsListItem
            facetType="headquarters"
            name={t.facets.administrative_area}
            items={facetHeadquarters}
          />
        </List>
      </div>
    </div>
  )
}

export default Facets
