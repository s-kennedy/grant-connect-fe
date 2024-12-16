import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import * as d3 from 'd3'
import _, { isEmpty } from 'lodash'

import { formatNumber, numberWithCommas } from 'utils/helpers'
import { selectFunderPrecalculatedInfo } from 'store/selectors/profile'

const GiftAnalysisCause = () => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const graphRef = React.createRef()
  const causeRef = React.createRef()
  const legendRef = React.createRef()
  const tooltipRef = React.createRef()

  const pieWidth = 200
  const pieHeight = 200
  const pieThickness = 25
  const radius = Math.min(pieWidth, pieHeight) / 2 - pieThickness

  const [causes, setCauses] = useState([])
  const [displayByAmount, setDisplayByAmount] = useState(true)
  const [selectedCause, setSelectedCause] = useState('')

  const { giftAnalysisCause } = useSelector(selectFunderPrecalculatedInfo) || []

  useEffect(() => {
    const causesByAmount = _(giftAnalysisCause)
      .filter(item => item.amount && !item.amountIsNegligible)
      .orderBy(['amount'], ['desc'])
      .value()

    if (isEmpty(causesByAmount)) {
      setDisplayByAmount(false)

      const causesByCount = _(giftAnalysisCause)
        .filter(item => item.count && !item.countIsNegligible)
        .orderBy(['count'], ['desc'])
        .value()
      setCauses(causesByCount)
      return
    }
    setCauses(causesByAmount)
  }, [giftAnalysisCause, setCauses, setDisplayByAmount])

  useEffect(() => {
    const createTooltipContent = ({
      name,
      amount,
      percentageAmount,
      count = 0,
      percentageCount = 0
    }) => {
      const countDiv = `
        <div>
          <b>${t.funder.numGifts}</b>
          ${numberWithCommas(count)} <i>(${_.round(percentageCount, 2)}%)</i>
        </div>`

      const amountDiv = `
        <div>
          <b>${t.funder.amountOfGifts}</b>
          ${formatNumber(amount)}<i> (${_.round(percentageAmount, 2)}%)</i>
        </div>`

      return `
        <div style='font-size:18px'><b>${name} </b></div>
        ${countDiv}
        ${amountDiv}
        `
    }

    const wrap = (text, width) => {
      text.each(function () {
        let _height = 0
        let text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          x = text.attr('x'),
          y = text.attr('y'),
          dy = 1.1,
          tspan = text
            .text(null)
            .append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('dy', dy + 'em')
        while ((word = words.pop())) {
          line.push(word)
          tspan.text(line.join(' '))
          if (tspan.node().getComputedTextLength() > width) {
            line.pop()
            tspan.text(line.join(' '))
            line = [word]
            tspan = text
              .append('tspan')
              .attr('x', x)
              .attr('y', y)
              .attr('dy', ++lineNumber * lineHeight + dy + 'em')
              .text(word)
            _height += 15
          }
        }
        _height += 15 + 8
        text.attr('height', _height)
      })
    }

    const createBarChart = () => {
      const suqreSize = 12

      // set the color scale
      var color = d3.scaleSequential(d3.interpolateRainbow).domain([0, causes.length])

      // .scaleLinear()
      // .domain([1, 13])
      // .range(["#1e4b7a", "#e8edf1"]);

      // Compute the position of each group on the pie:
      const pie = d3.pie().value((d, index) => {
        return displayByAmount ? d.amount : d.count
      })

      const tooltip = d3.select(tooltipRef.current)
      const mobileTooltip = d3.select(causeRef.current)

      const chartSVG = d3
        .select(graphRef.current)
        .append('svg')
        .attr('width', pieWidth)
        .attr('height', pieHeight)
        .append('g')
        .attr('transform', 'translate(' + pieWidth / 2 + ',' + pieHeight / 2 + ')')

      // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
      chartSVG
        .selectAll('g.arc')
        .data(pie(causes))
        .enter()
        .append('path')
        .attr(
          'd',
          d3
            .arc()
            .innerRadius(100) // This is the size of the donut hole
            .outerRadius(radius)
        )
        .attr('fill', function (d, i) {
          return color(i)
        })
        .style('opacity', 1)
        .on('mouseover', (d, i) => {
          const desc = createTooltipContent(causes[i])
          if (window.innerWidth >= 768) {
            tooltip
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
            tooltip
              .style('left', d3.event.pageX + 20 + 'px')
              .style('top', d3.event.pageY - 20 + 'px')
          }
        })
        .on('mouseout', () => {
          if (window.innerWidth >= 768) {
            tooltip.style('display', 'none')
          }
        })
        .on('click', (d, i) => {
          if (window.innerWidth < 768) {
            setSelectedCause(cSelectedCause => {
              if (cSelectedCause === '' || cSelectedCause !== causes[i].name) {
                const desc = createTooltipContent(causes[i])
                mobileTooltip.html(desc)
                return causes[i].name
              }
              mobileTooltip.html('')
              return ''
            })
          }
        })

      const legendSVG = d3
        .select(legendRef.current)
        .append('svg')
        .attr('id', 'legendContainer')
        .attr('width', pieWidth)
        .attr('height', causes.length * (suqreSize + 12))
        .append('g')

      legendSVG
        .selectAll('legend')
        .data(causes)
        .enter()
        .append('rect')
        .attr('id', (d, i) => {
          return 'legendBox_' + i
        })
        .attr('x', 0)
        .attr('y', function (d, i) {
          return i * (suqreSize + 12)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr('width', suqreSize)
        .attr('height', suqreSize)
        .style('fill', function (d, i) {
          return color(i)
        })

      legendSVG
        .selectAll('values')
        .data(causes)
        .enter()
        .append('text')
        .attr('id', (d, i) => {
          return 'textPercent_' + i
        })
        .attr('x', suqreSize + 12)
        .attr('y', function (d, i) {
          return i * (suqreSize + 12) + suqreSize
        })
        .style('fill', '#76797b')
        .text(d => {
          return `${_.round(displayByAmount ? d.percentageAmount : d.percentageCount, 1)}%`
        })
        .attr('text-anchor', 'left')

      legendSVG
        .selectAll('titles')
        .data(causes)
        .enter()
        .append('text')
        .attr('id', (d, i) => {
          return 'textLegend_' + i
        })
        .style('fill', '#76797b')
        .style('padding-right', '3px')
        .text(function (d) {
          return `${d.name}`
        })
        .attr('x', suqreSize + 55)
        .attr('y', function (d, i) {
          return 0
        })
        .call(wrap, pieWidth - suqreSize - 55)
      let _y = 0
      for (let i = 0; i < causes.length; i++) {
        _y = 0
        if (i > 0) {
          _y =
            parseInt(document.getElementById(`textLegend_${i - 1}`).getAttribute('y')) +
            parseInt(document.getElementById(`textLegend_${i - 1}`).getAttribute('height'))
        }
        d3.select(`#textLegend_${i}`).attr('y', _y)
        d3.select(`#textPercent_${i}`).attr('y', _y + 13)
        d3.select(`#legendBox_${i}`).attr('y', _y + 4)

        const node = d3.select(`#textLegend_${i}`).node()
        const children = Array.from(node.childNodes)
        for (var j = 0; j < children.length; j++) {
          children[j].setAttribute('y', _y)
        }
      }
      d3.select(`#legendContainer`).attr('height', _y + 30)
    }

    if (causes.length) {
      if (graphRef.current) graphRef.current.innerHTML = ''
      if (causeRef.current) causeRef.current.innerHTML = ''
      if (legendRef.current) legendRef.current.innerHTML = ''
      if (tooltipRef.current) tooltipRef.current.innerHTML = ''

      createBarChart()
    }
  }, [causes])

  return (
    <div>
      {causes.length > 0 && (
        <div className="Profile-gift-analysis-chart">
          <h4>{t.funder.giftBreakdownCause}</h4>

          <div className="Profile-gift-analysis-subtitle">
            {t.funder[`chartSubtitle_cause_${displayByAmount ? 'amount' : 'count'}`]}
          </div>

          <div>
            <div
              className="Profile-gift-analysis-chart-container-cause"
              style={{ width: pieWidth, height: pieHeight }}
            >
              <div ref={graphRef} />
            </div>
            <div className="Profile-gift-analysis-mobile-desc" ref={causeRef} />
            <div className="Profile-gift-analysis-legend-container" style={{ width: pieWidth }}>
              <div ref={legendRef} />
            </div>
            <div className="Profile-gift-analysis-tooltip" ref={tooltipRef} />
          </div>
        </div>
      )}
    </div>
  )
}

export default GiftAnalysisCause
