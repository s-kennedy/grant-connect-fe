// Global DOM Components.
import React, { Component } from 'react'
import { Col, Row } from 'react-flexbox-grid'
import TextTruncate from 'react-text-truncate'
import { Place } from 'material-ui-icons'

// Custom DOM Components.
import ProfileLinkedList from './ProfileLinkedList'

// Helpers.
import { stripTags } from '../../../utils/helpers'
import _ from 'lodash'
// Controllers.
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'

// App Language.
import { getLanguage } from 'data/locale'

class ProfileAbout extends Component {
  state = {
    missionExpanded: false,
    profileAffiliations: {},
    profileMedia: {},
    profileLanguage: null
  }

  componentDidMount() {
    const { funderInfo } = this.props
    // Getting the affiliations info.
    const affiliations = funderInfo.data.relationships.affiliations

    if (affiliations.data !== null && affiliations.data.length !== 0) {
      const affiliationsApiUrl = affiliations.links.related

      FunderController.getRelatedData(affiliationsApiUrl).then(profileAffiliations => {
        this.setState({ profileAffiliations })
      })
    }

    const lang = _.get(
      funderInfo.included.find(item => item.type === 'taxonomy_term--language'),
      'attributes.name'
    )
    if (lang) {
      this.setState({ profileLanguage: lang })
    }
  }

  componentWillUnmount() {
    const linkedinDiv = document.getElementsByClassName('profile-about-linkedin-widget')[0]

    if (typeof linkedinDiv !== 'undefined') {
      const linkedinScripts = linkedinDiv.getElementsByTagName('script')

      if (linkedinScripts.length > 0) {
        for (let i = 0; i < linkedinScripts.length; i++) {
          linkedinDiv.removeChild(linkedinScripts[i])
        }
      }
    }
  }

  toggleMission = e => {
    this.setState({ missionExpanded: !this.state.missionExpanded })

    e.preventDefault()
  }

  render() {
    const { missionExpanded, profileAffiliations } = this.state
    const { funderInfo, funderStatus } = this.props
    const linkedinId = funderInfo.data.attributes.linkedin
    let FunderAddress = {
      street: '',
      complement: '',
      city: '',
      province: '',
      zipCode: ''
    }
    if (
      _.has(funderInfo, 'data.attributes.address') &&
      !_.isEmpty(funderInfo.data.attributes.address)
    ) {
      FunderAddress = {
        street: _.isEmpty(funderInfo.data.attributes.address[0].address_line1)
          ? ''
          : funderInfo.data.attributes.address[0].address_line1,
        complement: _.isEmpty(funderInfo.data.attributes.address[0].address_line2)
          ? ''
          : funderInfo.data.attributes.address[0].address_line2,
        city: _.isEmpty(funderInfo.data.attributes.address[0].locality)
          ? ''
          : funderInfo.data.attributes.address[0].locality,
        province: _.isEmpty(funderInfo.data.attributes.address[0].administrative_area)
          ? ''
          : funderInfo.data.attributes.address[0].administrative_area,
        zipCode: _.isEmpty(funderInfo.data.attributes.address[0].postal_code)
          ? ''
          : funderInfo.data.attributes.address[0].postal_code
      }
      FunderAddress.full = `${_.isEmpty(FunderAddress.street) ? '' : FunderAddress.street}${
        _.isEmpty(FunderAddress.complement) ? '' : ' ' + FunderAddress.complement
      },
                            ${_.isEmpty(FunderAddress.city) ? '' : FunderAddress.city + ','}${
        _.isEmpty(FunderAddress.province) ? '' : ' ' + FunderAddress.province + ','
      }
                            ${_.isEmpty(FunderAddress.zipCode) ? '' : FunderAddress.zipCode}`
    }
    const { t } = getLanguage()
    const showContactInfo =
      funderInfo.data.attributes.phone !== null ||
      funderInfo.data.attributes.fax !== null ||
      funderInfo.data.attributes.email !== null

    let about = ''
    if (funderStatus == '') {
      about = <div className="profile-about__wrapper"></div>
    }
    if (funderStatus != 'Dissolved') {
      about = (
        <div className="profile-about__wrapper">
          <div className="profile-about__general-info">
            {_.has(funderInfo, 'data.attributes.title') && (
              <h3>{funderInfo.data.attributes.title}</h3>
            )}
            {funderInfo.data.attributes.field_description !== null && (
              <h4>{stripTags(funderInfo.data.attributes.field_description.value)}</h4>
            )}
            {funderInfo.data.attributes.year_est !== null && (
              <div className="profile-about-year">
                <span>
                  <strong>{`${t.funder.estabilished}: `}</strong>
                  {funderInfo.data.attributes.year_est}
                </span>
              </div>
            )}
            {!_.isEmpty(funderInfo.data.attributes.mission) && (
              <div className="profile-about-mission">
                <h4>{t.funder.mission}</h4>
                {missionExpanded && !_.isEmpty(funderInfo.data.attributes.mission) && (
                  <div>
                    <div
                      dangerouslySetInnerHTML={{ __html: funderInfo.data.attributes.mission.value }}
                    />
                    <a
                      href="#missionCollapsed"
                      className="profile-about-mission-collapse"
                      onClick={this.toggleMission}
                    >
                      {t.global.seeLess}
                    </a>
                  </div>
                )}
                {!missionExpanded && !_.isEmpty(funderInfo.data.attributes.mission) && (
                  <TextTruncate
                    line={2}
                    truncateText="..."
                    text={stripTags(funderInfo.data.attributes.mission.value)}
                    textTruncateChild={
                      <a
                        href="#missionExpanded"
                        className="profile-about-mission-expand"
                        onClick={this.toggleMission}
                      >
                        {t.global.seeMore}
                      </a>
                    }
                  />
                )}
              </div>
            )}
            <Row className="profile-about-info first">
              {typeof profileAffiliations.data !== 'undefined' && (
                <Col xs={12} sm={12} md={4}>
                  <ProfileLinkedList
                    headerTitle={t.funder.affiliations}
                    termData={profileAffiliations}
                    RenderElement="li"
                  />
                </Col>
              )}
              {!_.isEmpty(funderInfo.data.attributes.publication) && (
                <Col xs={12} sm={12} md={4}>
                  <h4>{t.funder.publications}</h4>
                  {funderInfo.data.attributes.publication.map((publication, index) => {
                    return (
                      <li key={index}>
                        <a href={publication.uri} target="_blank">
                          {publication.title}
                        </a>
                      </li>
                    )
                  })}
                </Col>
              )}
              {/* Business number should only display if it contains "RR" or "EIN" */}
              {funderInfo.data.attributes.bn !== null &&
                (funderInfo.data.attributes.bn.search('RR') > -1 ||
                  funderInfo.data.attributes.bn.search('EIN') > -1) && (
                  <Col xs={12} sm={12} md={4}>
                    <h4>{t.funder.bn}</h4>
                    <span>{funderInfo.data.attributes.bn}</span>
                  </Col>
                )}
            </Row>
            <Row className="profile-about-contact-info">
              <Col md={12}>
                <h4>{t.funder.contactInfo}</h4>
              </Col>
              {!_.isEmpty(FunderAddress) && (
                <Col xs={12} sm={12} md={4}>
                  <Place />

                  <a
                    href={`https://www.google.ca/maps/place/${FunderAddress.street}, ${FunderAddress.city} ${FunderAddress.province} ${FunderAddress.zipCode}`}
                    target="_blank"
                  >
                    {FunderAddress.full}
                  </a>
                </Col>
              )}
              <Col xs={12} sm={12} md={8}>
                <Row>
                  {showContactInfo !== false && (
                    <Col xs={12} sm={12} md={6}>
                      {funderInfo.data.attributes.phone !== null && (
                        <span>
                          <strong>{`${t.funder.phone}:`}</strong>
                          <br />
                          <span>{funderInfo.data.attributes.phone}</span>
                        </span>
                      )}
                      {funderInfo.data.attributes.phone_ext !== null && (
                        <span>
                          <strong> {`${t.funder.ext}`} </strong>
                          <span>{funderInfo.data.attributes.phone_ext}</span>
                        </span>
                      )}
                      <p></p>
                      {!_.isEmpty(funderInfo.data.attributes.fax) && (
                        <span>
                          <strong>{`${t.funder.fax}:`}</strong>
                          <br />
                          <span>{funderInfo.data.attributes.fax}</span>
                        </span>
                      )}
                    </Col>
                  )}
                  <Col xs={12} sm={12} md={6}>
                    <span>
                      <strong>{`${t.global.language}:`}</strong>
                      <br />
                      {this.state.profileLanguage}
                    </span>
                  </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col xs={12} sm={12} md={12}>
                    {showContactInfo !== false && !_.isEmpty(funderInfo.data.attributes.email) && (
                      <span>
                        <strong>{`${t.global.email}:`}</strong>
                        <br />
                        <span>
                          <a href={'mailto:' + funderInfo.data.attributes.email}>
                            {funderInfo.data.attributes.email}
                          </a>
                        </span>
                      </span>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="profile-about-contact-note">
              <Col md={12}>
                {funderInfo.data.attributes.contact_note !== null && (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: funderInfo.data.attributes.contact_note.value
                    }}
                  />
                )}
              </Col>
            </Row>
          </div>
        </div>
      )
    } else {
      about = (
        <div className="profile-about__wrapper">
          <div className="profile-about__general-info">
            {funderInfo.data.attributes.field_description !== null && (
              <h4>{stripTags(funderInfo.data.attributes.field_description.value)}</h4>
            )}
            {funderInfo.data.attributes.field_description === null && (
              <h3>{funderInfo.data.attributes.title}</h3>
            )}

            <Row className="profile-about-info first">
              {typeof profileAffiliations.data !== 'undefined' && (
                <Col xs={12} sm={12} md={4}>
                  <ProfileLinkedList
                    headerTitle={t.funder.affiliations}
                    termData={profileAffiliations}
                    RenderElement="li"
                  />
                </Col>
              )}
              {/* Business number should only display if it contains "RR" or "EIN" */}
              {funderInfo.data.attributes.bn !== null &&
                (funderInfo.data.attributes.bn.search('RR') > -1 ||
                  funderInfo.data.attributes.bn.search('EIN') > -1) && (
                  <Col xs={12} sm={12} md={4}>
                    <h4>{t.funder.bn}</h4>
                    <span>{funderInfo.data.attributes.bn}</span>
                  </Col>
                )}
            </Row>
          </div>
        </div>
      )
    }
    return about
  }
}

export default ProfileAbout
