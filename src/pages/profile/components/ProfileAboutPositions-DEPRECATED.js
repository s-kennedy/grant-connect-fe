// Global DOM components.
import React, { Component } from 'react'

import { stripTags } from '../../../utils/helpers'

// Controllers.
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'

class ProfileAboutPositions extends Component {
  state = {
    renderComponent: false,
    positions: {}
  }

  componentWillMount() {
    const { funderInfo } = this.props
    let formattedPositions = []

    // Get all the roles in advance.
    FunderController.getAllRoles().then(roles => {
      if (funderInfo.data.relationships.contact.data.length !== 0) {
        const positionsApiUrl = funderInfo.data.relationships.contact.links.related

        FunderController.getRelatedData(positionsApiUrl).then(positions => {
          const funderPositions = FunderController.formatPositions(positions, roles)

          for (let role in funderPositions) {
            formattedPositions.push({
              role: role,
              data: funderPositions[role]
            })
          }

          this.setState({
            positions: formattedPositions,
            renderComponent: true
          })
        })
      }
    })
  }

  render() {
    const { positions, renderComponent } = this.state

    if (renderComponent) {
      return (
        <div className="profile-positions-wrapper row">
          {positions.map((position, index) => {
            return (
              <div key={index} className="col-xs-6">
                <h4>{position.role}</h4>
                {position.data.map((positionInfo, positionIndex) => {
                  return (
                    <li key={positionIndex}>
                      {stripTags(positionInfo.data.name.trim())}
                      {positionInfo.data.position !== '' ? `, ${positionInfo.data.position}` : ''}
                    </li>
                  )
                })}
              </div>
            )
          })}
        </div>
      )
    }

    return ''
  }
}

export default ProfileAboutPositions
