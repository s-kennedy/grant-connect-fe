import React, { useState } from 'react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'react-flexbox-grid'
import TruncateMarkup from 'react-truncate-markup'
import ReactHtmlParser from 'react-html-parser'
import { Place } from 'material-ui-icons'

import { stripTags, getFullAddress } from 'utils/helpers'

import ProfileLinkedList from '../../../pages/profile/components/ProfileLinkedList.js'

export const DissolvedView = ({ name, description, funderAffiliations, businessNumber }) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  return (
    <div className="profile-about__wrapper">
      <div className="profile-about__general-info">
        <h3>{name}</h3>
        {description !== null && <h4>{stripTags(description)}</h4>}

        <Row className="profile-about-info first">
          {Array.isArray(funderAffiliations) && !!funderAffiliations.length && (
            <Col xs={12} sm={12} md={4}>
              <ProfileLinkedList
                headerTitle={t.funder.affiliations}
                termData={funderAffiliations}
                RenderElement="li"
              />
            </Col>
          )}
          {/* Business number should only display if it contains "RR" or "EIN" */}
          {businessNumber &&
            (businessNumber.search('RR') > -1 || businessNumber.search('EIN') > -1) && (
              <Col xs={12} sm={12} md={4}>
                <h4>{t.funder.bn}</h4>
                <span>{businessNumber}</span>
              </Col>
            )}
        </Row>
      </div>
    </div>
  )
}

export const ActiveView = ({
  addresses,
  businessNumber,
  description,
  faxNumber,
  funderAffiliations,
  funderPublications,
  language,
  mission,
  name,
  phoneNumber,
  phoneNumberExtension,
  primaryEmail,
  secondaryEmail,
  // TODO: Implement
  yearEstablished,
  contactNote
}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const [missionToggled, setMissionToggled] = useState(false)
  const toggleMission = e => {
    e.preventDefault()
    setMissionToggled(!missionToggled)
  }

  const funderAddress = Array.isArray(addresses) && addresses[0]
  const showContactInfo = phoneNumber || faxNumber || primaryEmail || secondaryEmail
  const readMoreEllipsis = (
    <span>
      <br />
      <a href="#" className="profile-about-mission-expand" onClick={toggleMission}>
        {t.global.seeMore}
      </a>
    </span>
  )

  return (
    <div className="profile-about__wrapper">
      <div className="profile-about__general-info">
        {name ? <h3>{name}</h3> : null}
        {description && <h4>{stripTags(description)}</h4>}
        {yearEstablished && (
          <div className="profile-about-year">
            <span>
              <strong>{`${t.funder.estabilished}: `}</strong>
              {yearEstablished}
            </span>
          </div>
        )}
        {mission && (
          <div className="profile-about-mission">
            <h4>{t.funder.mission}</h4>
            {missionToggled && (
              <div>
                <div>
                  <p dangerouslySetInnerHTML={{ __html: mission }} />
                </div>
                <a href="#" className="profile-about-mission-collapse" onClick={toggleMission}>
                  {t.global.seeLess}
                </a>
              </div>
            )}
            {!missionToggled && (
              <div>
                <TruncateMarkup lines={6} ellipsis={readMoreEllipsis}>
                  <div>{ReactHtmlParser(mission)}</div>
                </TruncateMarkup>
              </div>
            )}
          </div>
        )}
        <Row className="profile-about-info first">
          {Array.isArray(funderAffiliations) && !!funderAffiliations.length && (
            <Col xs={12} sm={12} md={4}>
              <ProfileLinkedList
                headerTitle={t.funder.affiliations}
                termData={funderAffiliations}
                RenderElement="li"
              />
            </Col>
          )}
          {Array.isArray(funderPublications) && !!funderPublications.length && (
            <Col xs={12} sm={12} md={4}>
              <h4>{t.funder.publications}</h4>
              {funderPublications.map((publication, index) => {
                return (
                  <li key={index}>
                    <a href={publication.url} target="_blank">
                      {publication.title}
                    </a>
                  </li>
                )
              })}
            </Col>
          )}
          {/* Business number should only display if it contains "RR" or "EIN" */}
          {businessNumber &&
            (businessNumber.search('RR') > -1 || businessNumber.search('EIN') > -1) && (
              <Col xs={12} sm={12} md={4}>
                <h4>{t.funder.bn}</h4>
                <span>{businessNumber}</span>
              </Col>
            )}
        </Row>
        <Row className="profile-about-contact-info">
          <Col md={12}>
            <h4>{t.funder.contactInfo}</h4>
          </Col>
          {funderAddress && (
            <Col xs={12} sm={12} md={4}>
              <Place />
              <a
                href={`https://www.google.ca/maps/place/${[
                  funderAddress.streetAddress1,
                  funderAddress.city,
                  funderAddress.province,
                  funderAddress.postalCode
                ]
                  .filter(Boolean)
                  .join(', ')}`}
                target="_blank"
              >
                {getFullAddress(funderAddress)}
              </a>
            </Col>
          )}
          <Col xs={12} sm={12} md={8}>
            <Row>
              {showContactInfo !== false && (
                <Col xs={12} sm={12} md={6}>
                  {phoneNumber !== null && (
                    <span>
                      <strong>{`${t.funder.phone}:`}</strong>
                      <br />
                      <span>{phoneNumber}</span>
                      {phoneNumberExtension !== null && (
                        <span>
                          , {t.funder.ext} {phoneNumberExtension}
                        </span>
                      )}
                    </span>
                  )}
                  <p></p>
                  {faxNumber && (
                    <span>
                      <strong>{`${t.funder.fax}:`}</strong>
                      <br />
                      <span>{faxNumber}</span>
                    </span>
                  )}
                </Col>
              )}
              <Col xs={12} sm={12} md={6}>
                <span>
                  <strong>{`${t.global.language}:`}</strong>
                  <br />
                  {t.global.languages[language]}
                </span>
              </Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Col xs={12} sm={12} md={12}>
                {showContactInfo !== false && (primaryEmail || secondaryEmail) && (
                  <span>
                    <strong>{`${t.global.email}:`}</strong>
                    {primaryEmail && (
                      <React.Fragment>
                        <br />
                        <span>
                          <a href={'mailto:' + primaryEmail}>{primaryEmail}</a>
                        </span>
                      </React.Fragment>
                    )}
                    {secondaryEmail && (
                      <React.Fragment>
                        <br />
                        <span>
                          <a href={'mailto:' + secondaryEmail}>{secondaryEmail}</a>
                        </span>
                      </React.Fragment>
                    )}
                  </span>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="profile-about-contact-note">
          <Col md={12}>
            {contactNote && <p dangerouslySetInnerHTML={{ __html: contactNote }} />}
          </Col>
        </Row>
      </div>
    </div>
  )
}
