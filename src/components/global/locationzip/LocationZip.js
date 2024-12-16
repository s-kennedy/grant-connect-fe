import React, { Component } from 'react'
import { lookup } from 'zipcodes'
import renderHTML from 'react-render-html'

class LocationZip extends Component {
  render() {
    let locationInfo = ''
    if (this.props.location != '') {
      const location = lookup(this.props.location)
      if (
        typeof location !== 'undefined' &&
        typeof location.city !== 'undefined' &&
        typeof location.state !== 'undefined'
      ) {
        locationInfo = `${location.city} (${location.state})`
      }
      locationInfo = renderHTML(locationInfo)
    }

    return <div>{locationInfo}</div>
  }
}

export default LocationZip
