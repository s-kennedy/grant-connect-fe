import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
import { IconButton } from 'material-ui'
import { Save } from 'material-ui-icons'

import { getNextDeadlinesFromPrograms } from 'components/Deadlines/helpers'
import { getDashFormatDate, getCurrentDate } from 'utils/dates'

const getCsvFilename = () => {
  const date = getCurrentDate()
  const month = `0${date.month}`.slice(-2)
  const day = `0${date.day}`.slice(-2)
  const year = date.year

  return `Pipeline.Portefeuille-GrantConnect.ConnexionSubvention-${month}_${day}_${year}.csv`
}

const csvGenerator = (pipelineData, t) => {
  const filename = getCsvFilename()

  const headers = [
    { label: t.csv.funderName, key: 'funderName' },
    { label: t.csv.pipelineStage, key: 'pipelineStage' },
    { label: t.csv.notes, key: 'notes' },
    { label: t.csv.requestSize, key: 'requestSize' },
    { label: t.csv.upcomingDeadline, key: 'upcomingDeadline' },
    { label: t.csv.website, key: 'website' },
    { label: t.csv.email, key: 'email' },
    { label: t.csv.phone, key: 'phone' }
  ]

  const data = pipelineData
    .filter(item => !item.hidden)
    .map(({ funder, organizationFunderOpportunityNotes, pipelineStage, requestSize }) => {
      const { name, websiteUrl, primaryEmail, phoneNumber, funderPrograms } = funder

      const notes = organizationFunderOpportunityNotes.map(({ note }) => note)
      const { hasOngoingDeadline, closestDeadlineDate } = getNextDeadlinesFromPrograms(
        funderPrograms
      )

      const formattedClosestDeadline =
        hasOngoingDeadline && !closestDeadlineDate.isValid
          ? t.funder.ongoing
          : getDashFormatDate(closestDeadlineDate)

      return {
        funderName: name,
        pipelineStage: pipelineStage.name,
        notes: notes.join('\n'),
        requestSize: requestSize,
        upcomingDeadline: formattedClosestDeadline,
        website: websiteUrl,
        email: primaryEmail,
        phone: phoneNumber
      }
    })
    .sort((a, b) => a.funderName.localeCompare(b.funderName))

  return { filename, headers, data }
}

const PipelineDownloadButton = ({ pipelineData, download, className }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const [csvReport, setCsvReport] = useState({ filename: '', headers: [], data: [] })
  const csvLink = useRef()

  const csvUpdate = () => {
    const newCsvReport = csvGenerator(pipelineData, t)
    setCsvReport(newCsvReport)
  }

  useEffect(csvUpdate, [pipelineData])

  const csvDownloadHandler = () => {
    csvUpdate()
    csvLink.current.link.click()
  }

  return download ? (
    <IconButton
      tooltip={t.pipeline.exportPipeline}
      onClick={csvDownloadHandler}
      className={className}
    >
      <CSVLink {...csvReport} ref={csvLink} />
      <Save />
    </IconButton>
  ) : null
}

export default PipelineDownloadButton
