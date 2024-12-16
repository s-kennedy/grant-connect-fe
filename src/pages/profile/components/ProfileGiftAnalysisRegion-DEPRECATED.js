import React, { Component } from 'react'
import { connect } from 'react-redux'

// Libraries
import * as d3 from 'd3'
import * as topojson from 'topojson'

// Helpers.
import _ from 'lodash'

// App Language.
import { getLanguage } from 'data/locale'
import canadaTopo from '../../../data/canada.json'
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'
import TextLoading from '../../../components/global/loading/TextLoading'
import { formatNumber, numberWithCommas } from '../../../utils/helpers'

class ProfileGiftAnalysisRegion extends Component {
  state = { data: undefined, selectedProvince: '' }
  constructor(props) {
    super(props)
    this.funderNID = props.nid
    ;(this.mapRatio = 0.5), (this.mapRatioAdjuster = 0.15)
    this.mapWidth = 200
    this.mapHeight = 200
    this.mapCenter = [5, 20]

    this.createMap = this.createMap.bind(this)
    this.createTooltipContent = this.createTooltipContent.bind(this)
  }

  componentDidMount() {
    FunderController.getFunderGiftByRegion(this.funderNID).then(result => {
      let regions = Object.keys(result.causes).map(key => result.causes[key])

      let data = _.orderBy(regions, ['count'], ['desc'])
      this.setState({ data: data })
      if (data && data.length > 0) {
        this.tooltipBubble = d3.select(this.tooltip)
        this.color = d3.scaleLinear().domain([0, 10]).range(['#e8edf1', '#1e4b7a'])

        this.createMap()
        window.addEventListener('resize', this.createMap)
      }
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.createMap)
  }

  createTooltipContent(mapProp) {
    const { language, t } = getLanguage()
    const hoverName = mapProp.properties[`name_${language}`]
    let provinceValues = {}
    let desc = ''
    for (let i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].name === hoverName) {
        provinceValues = this.state.data[i]
      }
    }
    if (provinceValues.tid) {
      let value = formatNumber(provinceValues.amount)
      desc = `<div style='font-size:18px'><b>${provinceValues.name} </b></div>
              <div>
                  <b>${t.funder.numGifts}</b> ${numberWithCommas(provinceValues.count)}
                  <i>(${_.round(provinceValues.percentage_count * 100, 2)}%)</i>
              </div>
              <div>
                  <b>${t.funder.amountOfGifts}</b> ${value}
                  <i>(${_.round(provinceValues.percentage_amount * 100, 2)}%)</i>
              </div>`
    }

    return desc
  }

  createMap() {
    let scale = 1
    this.mapWidth = this.graph.clientWidth
    if (window.innerWidth >= 1200) {
      this.mapHeight = 220
      scale = this.mapWidth * 1.1
    } else if (window.innerWidth < 1200 && window.innerWidth >= 990) {
      this.mapHeight = 170
      scale = this.mapWidth
    } else if (window.innerWidth < 990 && window.innerWidth >= 768) {
      this.mapHeight = 300
      scale = this.mapWidth
    } else if (window.innerWidth < 768 && window.innerWidth >= 450) {
      this.mapHeight = 400
      scale = this.mapWidth
    } else if (window.innerWidth < 450) {
      this.mapHeight = 300
      scale = this.mapWidth
    }

    if (!!this.svg) this.svg.remove()
    if (!!this.legendSVG) {
      this.legendSVG.remove()
      d3.select(this.legend).html('')
    }
    this.svg = d3.select(this.graph).append('svg')
    this.features = this.svg.append('g')
    this.featureList = topojson.feature(canadaTopo, canadaTopo.objects.canada)

    this.projection = d3
      .geoMercator()
      .rotate([100, -45])
      .center(this.mapCenter)
      .translate([this.mapWidth / 2, this.mapHeight / 2])
      .scale(scale)

    this.path = d3.geoPath().projection(this.projection)

    this.svg.attr('width', this.mapWidth).attr('height', this.mapHeight)

    this.features
      .selectAll('path')
      .data(this.featureList.features)
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('fill', (d, i) => {
        let index = -1
        const { language, t } = getLanguage()
        const hoverName = d.properties[`name_${language}`]
        let desc = ''
        for (let i = 0; i < this.state.data.length; i++) {
          if (this.state.data[i].name === hoverName) {
            index = i
          }
        }
        if (index > -1) {
          const perc = Math.floor(this.state.data[index].percentage_count * 10)
          return this.color(perc)
        } else {
          return '#FFFFFF'
        }
      })
      .attr('stroke', '#404040')
      .attr('stroke-width', 0.45)
      .on('mouseover', (d, i) => {
        const desc = this.createTooltipContent(d)
        if (window.innerWidth >= 768 && desc !== '') {
          this.tooltipBubble
            .html(desc)
            .style('display', 'inline-block')
            .style('opacity', '0')
            .transition()
            .duration(200)
            .style('opacity', 1)
        }
      })
      .on('mousemove', (d, i) => {
        if (window.innerWidth >= 768) {
          this.tooltipBubble
            .style('left', d3.event.layerX + this.graph.offsetLeft + 10 + 'px')
            .style(
              'top',
              d3.event.layerY +
                this.graph.offsetTop -
                this.mapHeight / 2 +
                (window.innerWidth >= 990 ? -20 : 50) +
                'px'
            )
        }
      })
      .on('mouseout', () => {
        if (window.innerWidth >= 768) {
          this.tooltipBubble.style('display', 'none')
        }
      })
      .on('click', (d, i) => {
        if (window.innerWidth < 768) {
          if (
            this.state.selectedProvince === '' ||
            this.state.selectedProvince !== d.properties[`name_en`]
          ) {
            const desc = this.createTooltipContent(d)
            d3.select(this.causeDetails).html(desc)
            this.setState({ selectedProvince: d.properties[`name_en`] })
          } else {
            d3.select(this.causeDetails).html('')
            this.setState({ selectedProvince: '' })
          }
        }
      })

    this.legendSVG = d3
      .select(this.legend)
      .append('svg')
      .attr('width', this.mapWidth)
      .attr('height', 30)
      .append('g')

    const defs = this.legendSVG.append('defs')

    const linearGradient = defs.append('linearGradient').attr('id', 'linear-gradient')
    linearGradient.attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%')
    linearGradient.append('stop').attr('offset', '0%').attr('stop-color', this.color(0))
    linearGradient.append('stop').attr('offset', '100%').attr('stop-color', this.color(9))

    this.legendSVG
      .append('rect')
      .attr('width', this.mapWidth * 0.65)
      .attr('height', 15)
      .style('fill', 'url(#linear-gradient)')
      .attr('transform', 'translate(' + this.mapWidth * 0.3 + ', 0)')

    this.legendSVG
      .append('text')
      .style('fill', '#666666')
      .text(() => {
        return `0%`
      })
      .attr('font-size', '10px')
      .attr('x', this.mapWidth * 0.3)
      .attr('y', 30)

    this.legendSVG
      .append('text')
      .style('fill', '#666666')
      .text(() => {
        return `100%`
      })
      .attr('font-size', '10px')
      .attr('x', this.mapWidth - 30)
      .attr('y', 30)
  }

  render() {
    const { t } = getLanguage()
    return (
      <div>
        {!!this.state.data && this.state.data.length > 0 && (
          <div className="Profile-gift-analysis-chart">
            <h4>{t.funder.giftBreakdownRegion}</h4>

            <div className="Profile-gift-analysis-subtitle">{t.funder.chartSubtitle_region}</div>

            <div className="Profile-gift-analysis-chart-container-region">
              <div ref={graph => (this.graph = graph)} />
              <div
                className="Profile-gift-analysis-mobile-desc"
                ref={causeDetails => (this.causeDetails = causeDetails)}
              />
              <div ref={legend => (this.legend = legend)} />
            </div>
            <div
              className="Profile-gift-analysis-tooltip"
              ref={tooltip => (this.tooltip = tooltip)}
            />
          </div>
        )}
      </div>
    )
  }
}
export default ProfileGiftAnalysisRegion
