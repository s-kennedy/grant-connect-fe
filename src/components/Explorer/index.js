import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useHistory } from 'react-router-dom'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { Paper } from 'material-ui'
import { Star, Undo, Close, ArrowForward } from 'material-ui-icons'
import _ from 'lodash'

import SearchBar from './components/SearchBar'
import SavedSearchesDropdown from './components/SavedSearchesDropdown'
import SaveSearch from './components/SaveSearch'
import DataTable from './components/DataTable'
import Loader from './components/Loader'
import ButtonWithIcon from './components/ButtonWithIcon'
import ResultsSummary from './components/ResultsSummary'
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'

import mockData from 'data/ge-data/default.json'
import mockDataFocus from 'data/ge-data/focus-health_order-amount.json'
import mockDataFunder from 'data/ge-data/funder-canadahelps_location-vancouver-bc_focus-education_order-amount.json'
import mockDataRecipient from 'data/ge-data/recipient-kitchener-waterloo-art-gallery_min-amount-10000_order-year.json'
import mockDataRecipientSize from 'data/ge-data/recipient-size-range-5000-15000_focus-religion_order-amount.json'
import mockDataYear from 'data/ge-data/year-2018.json'
import mockAutocompleteResults from 'data/mock-autocomplete-results.json'

const Explorer = ({ url }) => {
  const { i18n } = useTranslation()
  const history = useHistory()
  const location = useLocation()
  const t = i18n.getResourceBundle(i18n.language)
  const [ autocompleteResults, setAutocompleteResults ] = useState([])
  const [ autocompleteValue, setAutocompleteValue ] = useState(null)
  const [ searchTerm, setSearchTerm ] = useState("")
  const [ records, setRecords ] = useState([])
  const [ loading, setLoading ] = useState(false)
  const [ searchLoading, setSearchLoading ] = useState(false)
  const filtersFromParams = {}
  const urlParams = new URLSearchParams(location.search);
  urlParams.forEach((value, key) => {
    filtersFromParams[key] = value
  })
  const [ filters, setFilters ] = useState(filtersFromParams)
  const [ showSaveSearchModal, setShowSaveSearchModal ] = useState(false) 
  const [ savedSearches, setSavedSearches ] = useState([])
  const [ filterStack, setFilterStack ] = useState([])

  const reset = () => {
    setFilters({})
    setSearchTerm("")
    setAutocompleteValue(null)
    setAutocompleteResults([])
  }

  const updateSearchParams = () => {
    const newParams = new URLSearchParams(filters)
    const newPath = `${location.pathname}?${newParams.toString()}`
    const currentPath = `${location.pathname}${location.search}`
    if (newPath !== currentPath) {
      history.push(newPath)
    }
  }

  const updateFilterStack = () => {
    const lastInStack = filterStack[filterStack.length - 1]
    if (!_.isEqual(lastInStack, filters)) {
      setFilterStack([...filterStack, filters])
    }
  }

  useEffect(() => {
    updateSearchParams()
    updateFilterStack()
    setLoading(true)
    setRecords([])
    setTimeout(() => {
      let filteredRecords = []
      if (filters['recipient_name']) {
        filteredRecords = filteredRecords.concat(mockDataRecipient.results)
      }

      if (filters['recipient_min_size'] || filters['recipient_max_size']) {
        filteredRecords = filteredRecords.concat(mockDataRecipientSize.results)
      }

      if (filters['funder_name'] || filters['location']) {
        filteredRecords = filteredRecords.concat(mockDataFunder.results)
      }

      if (filters['focus']) {
        filteredRecords = filteredRecords.concat(mockDataFocus.results)
      }

      if (filters['year_min'] || filters['year_max']) {
        filteredRecords = filteredRecords.concat(mockDataYear.results)
      }

      if (filteredRecords.length === 0) {
        filteredRecords = mockData.results
      }

      setRecords(filteredRecords)
      setLoading(false)
    }, 1000)
  }, [filters])

  const handleSearchChange = (event, newInputValue) => {
    setAutocompleteResults([])
    const query = newInputValue

    setSearchTerm(query)

    if (query?.length > 2) {
      const autocomplete = [{"field": "Keyword","match": query}].concat(mockAutocompleteResults.results)
      setAutocompleteResults(autocomplete)
    }
  }

  const onAutocompleteSelect = (event, value) => {
    if (value?.field === "Recipient") {
      handleFilterChange({ recipient_name: value.match })
    }

    if (value?.field === "Funder") {
      handleFilterChange({ funder_name: value.match })
    }

    if (value?.field === "Keyword") {
      handleFilterChange({ keyword: value.match })
    }

    setAutocompleteResults([])
    setAutocompleteValue(null)
    setSearchTerm("")
  }

  const handleFilterChange = (input) => {
    setFilters({
      ...filters,
      ...input
    })
  }

  const handleRemoveFilter = filterKey => {
    let newFilters = { ...filters } 
    delete newFilters[filterKey]
    setFilters(newFilters)
  }

  const undo = () => {
    const stack = [...filterStack]
    if (stack.length > 0) {
      const currentFilters = stack.pop()
      const previousFilters = stack[stack.length - 1]
      if (previousFilters) {
        setFilters(previousFilters)
      }

      console.log({stack})
      console.log({previousFilters})
      setFilterStack(stack)
    }
  }

  const saveSearch = (title) => {
    setSavedSearches([...savedSearches, { title, search: location.search }])
  }

  const applySearch = (index) => {
    const search = savedSearches[index]
    const newPath = `${location.pathname}${search.search}`
    const filtersFromParams = {}
    const urlParams = new URLSearchParams(search.search);
    urlParams.forEach((value, key) => {
      filtersFromParams[key] = value
    })
    setFilters(filtersFromParams)
    history.push(newPath)
  }

  const deleteSearch = (index) => {
    const newSearches = [...savedSearches]
    newSearches.splice(index, 1)
    setSavedSearches(newSearches)
  }

  const totalSum = records.length
  const totalAmount = records.reduce((sum, gift) => {
    return sum + gift.gift_amount
  }, 0)
  const formattedAmount = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(
    totalAmount,
  )
  
  return (
    <div className="Explorer">
      <Grid fluid className="grid">
        <Row>
          <Col xs={12}>
            <h1 className={'tw-text-2xl'}>{t.explorer.title}</h1>
            <p className="subtitle tw-mb-6">{t.explorer.subtitle}</p>
            <Paper elevation={1} className={`Material-cards Material-cards__expanded`}>
            <h2 className={'tw-text-lg tw-font-semibold tw-mt-0'}>{t.explorer.search}</h2>
              <SearchBar 
                placeholderText={t.explorer.search_placeholder}
                searchLoading={searchLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                autocompleteResults={autocompleteResults}
                handleSearchChange={handleSearchChange}
                handleFilterChange={handleFilterChange}
                onAutocompleteSelect={onAutocompleteSelect}
                autocompleteValue={autocompleteValue}
              />
              <div className="">
                <SavedSearchesDropdown savedSearches={savedSearches} applySearch={applySearch} deleteSearch={deleteSearch} />
              </div>
            </Paper>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Paper elevation={1} className={`Material-cards Material-cards__expanded`}>
              <div className="sm:tw-flex tw-justify-between tw-mb-1">
                <h2 className={'tw-text-lg tw-font-semibold tw-mb-1 tw-mt-0'}>{t.explorer.results}</h2>
                <div className="tw-flex tw-gap-1 tw-flex-wrap tw-mb-2">
                  <SaveSearch filters={filters} saveSearch={saveSearch} savedSearches={savedSearches} />
                  <ButtonWithIcon onClick={undo} color="grey" label="Undo" Icon={Undo} />
                  <ButtonWithIcon onClick={reset} color="dark-grey" label="Reset" Icon={Close} />
                </div>
              </div>
              <ResultsSummary filters={filters} handleRemoveFilter={handleRemoveFilter} />
              {loading ? (
                <div className="tw-w-full tw-h-40 tw-flex tw-justify-center tw-items-center">
                  <Loader />
                </div>
              ) : (
                <div>
                  <div className="tw-flex tw-justify-end tw-items-center tw-gap-1 tw-mb-1">
                    <span>{t.explorer.scroll}</span>
                    <ArrowForward style={{height: '18px', width: '18px'}} />
                  </div>
                  <DataTable records={records} handleFilterChange={handleFilterChange} filters={filters} />
                  <div className="tw-mt-4 tw-flex tw-gap-4">
                    <div className="tw-text-center">
                      <p className="tw-my-1">{`Total number of gifts`}</p>
                      <p className="tw-my-0 tw-font-semibold tw-text-lg">{totalSum}</p>
                    </div>
                    <div className="tw-text-center">
                      <p className="tw-my-1">{`Total amount of gifts`}</p>
                      <p className="tw-my-0 tw-font-semibold tw-text-lg">{formattedAmount}</p>
                    </div>
                  </div>
                </div>
              )}
            </Paper>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Paper elevation={1} className={`Material-cards Material-cards__expanded`}>
              <h2 className={'tw-text-lg tw-font-semibold tw-mt-0'}>{t.explorer.graphic_1_title}</h2>
              <BarChart records={records} />
            </Paper>
          </Col>
          <Col xs={12} md={6}>
            <Paper elevation={1} className={`Material-cards Material-cards__expanded`}>
              <h2 className={'tw-text-lg tw-font-semibold tw-mt-0'}>{t.explorer.graphic_2_title}</h2>
              <PieChart records={records} />
            </Paper>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p className="tw-my-6">{t.explorer.disclaimer}</p>
          </Col>
        </Row>
      </Grid>
    </div>
  )
}

export default Explorer
