import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import * as d3 from 'd3'
import * as topojson from 'topojson'
import _ from 'lodash'

import canadaTopo from 'data/canada.json'
import { formatNumber, numberWithCommas } from 'utils/helpers'
import { getLanguage } from 'data/locale'
import { selectFunderPrecalculatedInfo } from 'store/selectors/profile'

const GiftAnalysisRegion = () => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  let graphRef = React.createRef()
  let legendRef = React.createRef()
  let tooltipRef = React.createRef()
  let mobileTooltipRef = React.createRef()

  let mapWidth = 200
  let mapHeight = 200
  const mapCenter = [5, 20]

  const [regions, setRegions] = useState([])
  const [tooltipBubble, setTooltipBubble] = useState(0)
  const [colour, setColour] = useState()
  const [selectedProvince, setSelectedProvince] = useState('')

  const { giftAnalysisRegion } = useSelector(selectFunderPrecalculatedInfo) || []

  useEffect(() => {
    const regionsByAmount = _(giftAnalysisRegion)
      .filter(item => item)
      .orderBy(['amount'], ['desc'])
      .value()

    setRegions(regionsByAmount)
  }, [giftAnalysisRegion, setRegions])

  useEffect(() => {
    if (!regions.length) return

    setTooltipBubble(d3.select(tooltipRef.current))
    setColour(() => d3.scaleLinear().domain([0, 10]).range(['#e8edf1', '#1e4b7a']))
  }, [regions, setTooltipBubble, setColour])

  useEffect(() => {
    if (!colour || !tooltipBubble) return

    const createTooltipContent = mapProp => {
      const { language } = getLanguage()
      const hoverName = mapProp.properties[`name_${language}`]
      const provinceValues = regions.find(({ name }) => name === hoverName)

      if (!provinceValues) return ''

      const value = formatNumber(provinceValues.amount)

      const countDiv = `
        <div>
            <b>${t.funder.numGifts}</b> ${numberWithCommas(provinceValues.count)}
            <i>(${_.round(provinceValues.percentageCount, 2)}%)</i>
        </div>`

      const amountDiv = `
        <div>
            <b>${t.funder.amountOfGifts}</b> ${value}
            <i>(${_.round(provinceValues.percentageAmount, 2)}%)</i>
        </div>`

      return `<div style='font-size:18px'><b>${provinceValues.name} </b></div>
              ${countDiv}
              ${amountDiv}`
    }

    const createMap = () => {
      let scale = 1
      mapWidth = graphRef.current.clientWidth
      if (window.innerWidth >= 1200) {
        mapHeight = 220
        scale = mapWidth * 1.1
      } else if (window.innerWidth < 1200 && window.innerWidth >= 990) {
        mapHeight = 170
        scale = mapWidth
      } else if (window.innerWidth < 990 && window.innerWidth >= 768) {
        mapHeight = 300
        scale = mapWidth
      } else if (window.innerWidth < 768 && window.innerWidth >= 450) {
        mapHeight = 400
        scale = mapWidth
      } else if (window.innerWidth < 450) {
        mapHeight = 300
        scale = mapWidth
      }

      const svg = d3.select(graphRef.current).append('svg')
      const features = svg.append('g')
      const featureList = topojson.feature(canadaTopo, canadaTopo.objects.canada)

      const projection = d3
        .geoMercator()
        .rotate([100, -45])
        .center(mapCenter)
        .translate([mapWidth / 2, mapHeight / 2])
        .scale(scale)

      const path = d3.geoPath().projection(projection)

      const mobileTooltip = d3.select(mobileTooltipRef.current)

      svg.attr('width', mapWidth).attr('height', mapHeight)

      features
        .selectAll('path')
        .data(featureList.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', (d, i) => {
          let index = -1
          const { language } = getLanguage()
          const hoverName = d.properties[`name_${language}`]
          let desc = ''
          for (let i = 0; i < regions.length; i++) {
            if (regions[i].name === hoverName) {
              index = i
            }
          }
          if (index > -1) {
            const perc = Math.floor(regions[index].percentageCount / 10)
            return colour(perc)
          } else {
            return '#FFFFFF'
          }
        })
        .attr('stroke', '#404040')
        .attr('stroke-width', 0.45)
        .on('mouseover', (d, i) => {
          const desc = createTooltipContent(d)
          if (window.innerWidth >= 768 && desc !== '') {
            tooltipBubble
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
            tooltipBubble
              .style('left', d3.event.pageX + 20 + 'px')
              .style('top', d3.event.pageY - 20 + 'px')
          }
        })
        .on('mouseout', () => {
          if (window.innerWidth >= 768) {
            tooltipBubble.style('display', 'none')
          }
        })
        .on('click', (d, i) => {
          if (window.innerWidth < 768) {
            setSelectedProvince(cSelectedProvince => {
              if (cSelectedProvince === '' || cSelectedProvince !== d.properties[`name_en`]) {
                const desc = createTooltipContent(d)
                mobileTooltip.html(desc)
                return d.properties['name_en']
              }
              mobileTooltip.html('')
              return ''
            })
          }
        })

      const legendSVG = d3
        .select(legendRef.current)
        .append('svg')
        .attr('width', mapWidth)
        .attr('height', 30)
        .append('g')

      const defs = legendSVG.append('defs')

      const linearGradient = defs.append('linearGradient').attr('id', 'linear-gradient')
      linearGradient.attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%')
      linearGradient.append('stop').attr('offset', '0%').attr('stop-color', colour(0))
      linearGradient.append('stop').attr('offset', '100%').attr('stop-color', colour(9))

      legendSVG
        .append('rect')
        .attr('width', mapWidth * 0.65)
        .attr('height', 15)
        .style('fill', 'url(#linear-gradient)')
        .attr('transform', 'translate(' + mapWidth * 0.3 + ', 0)')

      legendSVG
        .append('text')
        .style('fill', '#666666')
        .text(() => {
          return `0%`
        })
        .attr('font-size', '10px')
        .attr('x', mapWidth * 0.3)
        .attr('y', 30)

      legendSVG
        .append('text')
        .style('fill', '#666666')
        .text(() => {
          return `100%`
        })
        .attr('font-size', '10px')
        .attr('x', mapWidth - 30)
        .attr('y', 30)
    }

    if (graphRef.current) graphRef.current.innerHTML = ''
    if (mobileTooltipRef.current) mobileTooltipRef.current.innerHTML = ''
    if (legendRef.current) legendRef.current.innerHTML = ''
    if (tooltipRef.current) tooltipRef.current.innerHTML = ''

    createMap()
  }, [regions, colour, tooltipBubble])

  return (
    <div>
      {regions.length > 0 && (
        <div className="Profile-gift-analysis-chart">
          <h4>{t.funder.giftBreakdownRegion}</h4>

          <div className="Profile-gift-analysis-subtitle">{t.funder.chartSubtitle_region}</div>

          <div className="Profile-gift-analysis-chart-container-region">
            <div ref={graphRef} />
            <div className="Profile-gift-analysis-mobile-desc" ref={mobileTooltipRef} />
            <div ref={legendRef} />
          </div>
          <div className="Profile-gift-analysis-tooltip" ref={tooltipRef} />
        </div>
      )}
    </div>
  )
}

export default GiftAnalysisRegion
