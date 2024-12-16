import React, { Component } from 'react'
// Redux.
import { connect } from 'react-redux'

// Libraries
import * as d3 from 'd3'

// Helpers.
import _ from 'lodash'

// App Language.
import { getLanguage } from 'data/locale'
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'
import TextLoading from '../../../components/global/loading/TextLoading'
import { formatNumber, numberWithCommas } from '../../../utils/helpers'

class ProfileGiftAnalysisCause extends Component {
  state = { data: undefined, selectedCause: '', displayByAmount: true }
  constructor(props) {
    super(props)
    this.pieWidth = 200
    this.pieHeight = 200
    this.pieThickness = 25
    this.funderNID = props.nid

    this.radius = Math.min(this.pieWidth, this.pieHeight) / 2 - this.pieThickness
    this.createBarChart = this.createBarChart.bind(this)
    this.createTooltipContent = this.createTooltipContent.bind(this)
  }

  componentDidMount() {
    FunderController.getFunderGiftByCause(this.funderNID).then(result => {
      let causes = Object.keys(result.causes).map(key => result.causes[key])
      causes = _.orderBy(causes, ['amount'], ['desc'])
      let causes_temp = causes.filter(element => element.percentage_amount > 0.0001)
      if (causes_temp.length === 0) {
        this.setState({ displayByAmount: false })
        causes = _.orderBy(causes, ['count'], ['desc'])
        causes_temp = causes.filter(element => element.percentage_count > 0.0001)
      }
      this.setState({ data: causes_temp })
      this.createBarChart()
    })
  }

  createTooltipContent(data) {
    // _.round((this.state.displayByAmount ? d.percentage_amount : d.percentage_count) * 100, 2);
    const { t } = getLanguage()
    let value = formatNumber(data.amount)
    const desc = `
                    <div style='font-size:18px'><b>${data.name} </b></div>
                    <div>
                      <b>${t.funder.numGifts}</b>
                      ${numberWithCommas(data.count)} <i>(${_.round(
      data.percentage_count * 100,
      2
    )}%)</i>
                    </div>
                    <div>
                      <b>${t.funder.amountOfGifts}</b>
                      ${value}<i> (${_.round(data.percentage_amount * 100, 2)}%)</i>
                    </div>`

    return desc
  }

  wrap(text, width) {
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

  createBarChart() {
    const suqreSize = 12

    // set the color scale
    var color = d3.scaleSequential(d3.interpolateRainbow).domain([0, this.state.data.length])

    // .scaleLinear()
    // .domain([1, 13])
    // .range(["#1e4b7a", "#e8edf1"]);

    // Compute the position of each group on the pie:
    const pie = d3.pie().value((d, index) => {
      return this.state.displayByAmount ? d.amount : d.count
    })

    const tooltip = d3.select(this.tooltip)

    const chartSVG = d3
      .select(this.graph)
      .append('svg')
      .attr('width', this.pieWidth)
      .attr('height', this.pieHeight)
      .append('g')
      .attr('transform', 'translate(' + this.pieWidth / 2 + ',' + this.pieHeight / 2 + ')')

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    chartSVG
      .selectAll('g.arc')
      .data(pie(this.state.data))
      .enter()
      .append('path')
      .attr(
        'd',
        d3
          .arc()
          .innerRadius(100) // This is the size of the donut hole
          .outerRadius(this.radius)
      )
      .attr('fill', function (d, i) {
        return color(i)
      })
      .style('opacity', 1)
      .on('mouseover', (d, i) => {
        const desc = this.createTooltipContent(this.state.data[i])
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
            .style('left', d3.event.layerX + 25 + 'px')
            .style('top', d3.event.layerY + this.graph.offsetTop - this.pieHeight / 2 - 10 + 'px')
        }
      })
      .on('mouseout', () => {
        if (window.innerWidth >= 768) {
          tooltip.style('display', 'none')
        }
      })
      .on('click', (d, i) => {
        if (window.innerWidth < 768) {
          if (
            this.state.selectedCause === '' ||
            this.state.selectedCause !== this.state.data[i].name
          ) {
            const desc = this.createTooltipContent(this.state.data[i])
            d3.select(this.causeDetails).html(desc)
            this.setState({ selectedCause: this.state.data[i].name })
          } else {
            d3.select(this.causeDetails).html('')
            this.setState({ selectedCause: '' })
          }
        }
      })

    const legendSVG = d3
      .select(this.legend)
      .append('svg')
      .attr('id', 'legendContainer')
      .attr('width', this.pieWidth)
      .attr('height', this.state.data.length * (suqreSize + 12))
      .append('g')

    legendSVG
      .selectAll('legend')
      .data(this.state.data)
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
      .data(this.state.data)
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
        return `${_.round(
          (this.state.displayByAmount ? d.percentage_amount : d.percentage_count) * 100,
          2
        )}%`
      })
      .attr('text-anchor', 'left')

    legendSVG
      .selectAll('titles')
      .data(this.state.data)
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
      .call(this.wrap, this.pieWidth - suqreSize - 55)
    let _y = 0
    for (let i = 0; i < this.state.data.length; i++) {
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

  render() {
    const { t } = getLanguage()
    return (
      <div>
        {!!this.state.data && this.state.data.length > 0 && (
          <div className="Profile-gift-analysis-chart">
            <h4>{t.funder.giftBreakdownCause}</h4>

            <div className="Profile-gift-analysis-subtitle">
              {t.funder[`chartSubtitle_cause_${this.state.displayByAmount ? 'amount' : 'count'}`]}
            </div>

            <div>
              <div
                className="Profile-gift-analysis-chart-container-cause"
                style={{ width: this.pieWidth, height: this.pieHeight }}
              >
                <div ref={graph => (this.graph = graph)} />
              </div>
              <div
                className="Profile-gift-analysis-mobile-desc"
                ref={causeDetails => (this.causeDetails = causeDetails)}
              />
              <div
                className="Profile-gift-analysis-legend-container"
                style={{ width: this.pieWidth }}
              >
                <div ref={legend => (this.legend = legend)} />
              </div>
              <div
                className="Profile-gift-analysis-tooltip"
                ref={tooltip => (this.tooltip = tooltip)}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default ProfileGiftAnalysisCause
