import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import MediaQuery from 'react-responsive'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { Paper } from 'material-ui'
import SearchBar from './components/SearchBar'
import SavedSearchesDropdown from './components/SavedSearchesDropdown'
import DataTable from './components/DataTable'
import Loader from './components/Loader'
import ButtonWithIcon from './components/ButtonWithIcon'
import ResultsSummary from './components/ResultsSummary'
import { Star, Undo, Close } from 'material-ui-icons'
import mockData from 'data/ge-data/default.json'
import mockDataFocus from 'data/ge-data/focus-health_order-amount.json'
import mockDataFunder from 'data/ge-data/funder-canadahelps_location-vancouver-bc_focus-education_order-amount.json'
import mockDataRecipient from 'data/ge-data/recipient-kitchener-waterloo-art-gallery_min-amount-10000_order-year.json'
import mockDataRecipientSize from 'data/ge-data/recipient-size-range-5000-15000_focus-religion_order-amount.json'
import mockDataYear from 'data/ge-data/year-2018.json'
import mockAutocompleteResults from 'data/mock-autocomplete-results.json'

const Explorer = ({ url }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const [ autocompleteResults, setAutocompleteResults ] = useState([])
  const [ autocompleteValue, setAutocompleteValue ] = useState(null)
  const [ searchTerm, setSearchTerm ] = useState("")
  const [ records, setRecords ] = useState([])
  const [ loading, setLoading ] = useState(false)
  const [ searchLoading, setSearchLoading ] = useState(false)
  const [ filters, setFilters ] = useState({})

  const reset = () => {
    setFilters({})
    setSearchTerm("")
    setAutocompleteValue(null)
    setAutocompleteResults([])gi
  }

  useEffect(() => {
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

  return (
    <div className="Explorer">
      <Grid fluid className="grid">
        <Row>
          <Col xs={12}>
            <Paper elevation={1} className={`Material-cards Material-cards__expanded`}>
              <h1 className={'tw-text-2xl'}>{t.explorer.title}</h1>
              <p className="subtitle">{t.explorer.subtitle}</p>
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
                <SavedSearchesDropdown />
              </div>
            </Paper>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Paper elevation={1} className={`Material-cards Material-cards__expanded`}>
              <div className="tw-flex tw-justify-between">
                <h2 className={'tw-text-lg tw-font-semibold'}>{t.explorer.results}</h2>
                <div className="tw-flex tw-gap-1">
                  <ButtonWithIcon color="grey" label="Save this search" Icon={Star} />
                  <ButtonWithIcon color="grey" label="Undo" Icon={Undo} />
                  <ButtonWithIcon color="dark-grey" label="Reset" Icon={Close} onClick={reset} />
                </div>
              </div>
              <ResultsSummary filters={filters} handleFilterChange={handleFilterChange} />
              {loading ? (
                <div className="tw-w-full tw-h-40 tw-flex tw-justify-center tw-items-center">
                  <Loader />
                </div>
              ) : (
                <DataTable records={records} handleFilterChange={handleFilterChange} filters={filters} />
              )}
            </Paper>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Paper elevation={1} className={`Material-cards Material-cards__expanded`}>
              <h2 className={'tw-text-lg tw-font-semibold'}>{t.explorer.graphic_1_title}</h2>
            </Paper>
          </Col>
          <Col xs={12} md={6}>
            <Paper elevation={1} className={`Material-cards Material-cards__expanded`}>
              <h2 className={'tw-text-lg tw-font-semibold'}>{t.explorer.graphic_2_title}</h2>
            </Paper>
          </Col>
        </Row>
      </Grid>
    </div>
  )
}

export default Explorer
