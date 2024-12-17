import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import MediaQuery from 'react-responsive'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { Paper } from 'material-ui'
import SearchBar from './components/SearchBar'
import SavedSearchesDropdown from './components/SavedSearchesDropdown'
import DataTable from './components/DataTable'
import Loader from './components/Loader'
import mockData from 'data/mock-gift-data.json'

const Explorer = ({ url }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const [ searchTerm, setSearchTerm ] = useState("")
  const [ records, setRecords ] = useState([])
  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setRecords(mockData.results)
      setLoading(false)
    }, 2000)
  }, [])


  return (
    <div className="Explorer">
      <Grid fluid className="grid">
        <Row>
          <Col xs={12}>
            <Paper elevation={1} className={`Material-cards Material-cards__expanded`}>
              <h1 className={'tw-text-2xl'}>{t.explorer.title}</h1>
              <p className="subtitle">{t.explorer.subtitle}</p>
              <SearchBar placeholderText={t.explorer.search_placeholder} />
              <div className="">
                <SavedSearchesDropdown />
              </div>
            </Paper>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Paper elevation={1} className={`Material-cards Material-cards__expanded`}>
              <h2 className={'tw-text-lg tw-font-semibold'}>{t.explorer.results}</h2>
              {loading ? (
                <div className="tw-w-full tw-h-40 tw-flex tw-justify-center tw-items-center">
                  <Loader />
                </div>
              ) : (
                <DataTable records={records} />
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
