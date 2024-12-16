// Global DOM Components.
import React, { Component } from 'react'

// Controllers.
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'

class ProfileLinkedIn extends Component {
  state = {
    missionExpanded: false,
    profileAffiliations: {},
    profileMedia: {},
    profileLanguage: null
  }

  componentDidMount() {
    const { funderInfo, funderStatus } = this.props
    const linkedinId = funderInfo.data.attributes.linkedin
    if (funderStatus != 'Dissolved') {
      if (linkedinId !== null) {
        // Adding the linkedin widget.
        const initialScript = document.createElement('script')
        initialScript.type = 'text/javascript'
        initialScript.async = true
        initialScript.src = '//platform.linkedin.com/in.js'
        this.instance.appendChild(initialScript)

        const widgetPluginScript = document.createElement('script')
        widgetPluginScript.type = 'IN/CompanyInsider'
        widgetPluginScript.async = true
        widgetPluginScript.setAttribute('data-id', linkedinId)
        this.instance.appendChild(widgetPluginScript)
      }
    }
    // Getting the affiliations info.
    const affiliations = funderInfo.data.relationships.affiliations

    if (affiliations.data !== null && affiliations.data.length !== 0) {
      const affiliationsApiUrl = affiliations.links.related

      FunderController.getRelatedData(affiliationsApiUrl).then(profileAffiliations => {
        this.setState({ profileAffiliations })
      })
    }

    // Getting the language info.
    if (
      funderInfo.data.relationships.language.data !== null &&
      funderInfo.data.relationships.language.data.length !== 0
    ) {
      const languageApiUrl = funderInfo.data.relationships.language.links.related

      FunderController.getRelatedData(languageApiUrl).then(profileLanguage => {
        this.setState({ profileLanguage: profileLanguage.data.attributes.name })
      })
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
    const { funderInfo, funderStatus } = this.props
    const linkedinId = funderInfo.data.attributes.linkedin

    let about = ''
    if (funderStatus == '') {
      about = <div className="profile-about__wrapper"></div>
    }
    if (funderStatus != 'Dissolved') {
      about = (
        <div className="profile-about__wrapper">
          {/* Linkedin Widget */}
          {linkedinId !== null && (
            <div
              className="profile-about-linkedin-widget--removed"
              ref={e => (this.instance = e)}
            />
          )}
        </div>
      )
    }
    return about
  }
}

export default ProfileLinkedIn
