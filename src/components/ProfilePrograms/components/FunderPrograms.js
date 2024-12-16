import React from 'react'
import { useTranslation } from 'react-i18next'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import ProgramDeadlines from './ProgramDeadlines'

const FunderPrograms = ({ funderPrograms, setProgramIndex }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const tabPanels = funderPrograms.map((program, index) => {
    const { description, grantRange, programContacts } = program
    const Description = () =>
      description ? <div dangerouslySetInnerHTML={{ __html: description }}></div> : null

    const ProgramContacts = () =>
      Array.isArray(programContacts) && programContacts.length
        ? programContacts.map((contact, i) => (
            <div key={i}>
              <h4>{t.funder.programContact}</h4>
              <div dangerouslySetInnerHTML={{ __html: contact.name }}></div>
            </div>
          ))
        : null

    return (
      <TabPanel key={index}>
        <Description />
        <div className="extra_contact">
          <ProgramContacts />
        </div>
        <ProgramDeadlines funderProgram={program} />
      </TabPanel>
    )
  })

  const tabs = funderPrograms.map((program, index) => <Tab key={index}>{program.name}</Tab>)

  return (
    <div>
      {Array.isArray(tabs) && tabs.length && (
        <Tabs className="row vertical-tabs" defaultIndex={0} onSelect={setProgramIndex}>
          <TabList className="col-xs-12 col-sm-12 col-md-4">{tabs}</TabList>
          <div className="col-xs-12 col-sm-12 col-md-8">{tabPanels}</div>
        </Tabs>
      )}
    </div>
  )
}

export default FunderPrograms
