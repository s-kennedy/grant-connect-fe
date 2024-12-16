import React from 'react'
import _ from 'lodash'
import { Col } from 'react-flexbox-grid'
import { useSelector } from 'react-redux'

import { selectFunderProfileInfo, selectIsFunderProfileDissolved } from 'store/selectors/profile'
import FinancialView from './components/FinancialView'
import ContactsView from './components/ContactsView'
import { ActiveView, DissolvedView } from './components/AboutViews'

const ProfileAbout = () => {
  const {
    addresses,
    businessNumber,
    description,
    faxNumber,
    financialCommentary,
    fiscalPeriodEnd,
    funderAffiliations,
    funderContacts,
    funderFinancialHistories,
    funderPublications,
    language,
    mission,
    name,
    phoneNumber,
    phoneNumberExtension,
    primaryEmail,
    secondaryEmail,
    yearEstablished,
    contactNote,
    showAllActivities
  } = useSelector(selectFunderProfileInfo)
  const isFunderDissolved = useSelector(selectIsFunderProfileDissolved)

  return (
    <React.Fragment>
      <Col xs={12} sm={12} md={12} lg={5}>
        {isFunderDissolved ? (
          <DissolvedView
            name={name}
            description={description}
            funderAffiliations={funderAffiliations}
            businessNumber={businessNumber}
          />
        ) : (
          <>
            <ActiveView
              name={name}
              description={description}
              funderAffiliations={funderAffiliations}
              businessNumber={businessNumber}
              addresses={addresses}
              phoneNumber={phoneNumber}
              phoneNumberExtension={phoneNumberExtension}
              faxNumber={faxNumber}
              funderPublications={funderPublications}
              language={language}
              mission={mission}
              primaryEmail={primaryEmail}
              secondaryEmail={secondaryEmail}
              yearEstablished={yearEstablished}
              contactNote={contactNote}
            />
            <ContactsView funderContacts={funderContacts} />
          </>
        )}
      </Col>
      {!isFunderDissolved && (
        <Col xs={12} sm={12} md={12} lg={7}>
          <FinancialView
            funderFinancialHistories={funderFinancialHistories}
            financialCommentary={financialCommentary}
            fiscalPeriodEnd={fiscalPeriodEnd}
            showAllActivities={showAllActivities}
          />
        </Col>
      )}
    </React.Fragment>
  )
}

export default ProfileAbout
