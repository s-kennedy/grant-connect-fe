// Global DOM Components.
import React, { Component } from 'react'
import { FlatButton } from 'material-ui'
import _ from 'lodash'
import { List, ListItem } from 'material-ui/List'
// App Language.
import { getLanguage } from 'data/locale'

class PipelineFilters extends Component {
  getLinkAttrs = (key, href, filterApplied, filterValue, filterName) => {
    const { applyFilters, resetFilters } = this.props
    if (!filterApplied) {
      return { key, href, onClick: () => applyFilters(filterValue, filterName) }
    } else {
      return { key, href, className: 'selected', onClick: () => resetFilters(filterName) }
    }
  }

  render() {
    const {
      pipelineFilters,
      pipelineStages,
      resetFilters,
      showHide,
      hideStage,
      allItems,
      pipelineArchived,
      showArchived,
      showArchivedState
    } = this.props
    const { t } = getLanguage()

    return (
      <div className="Pipeline__filters">
        <p>
          <small>{t.search.filters}</small>
          <FlatButton onClick={resetFilters} label={t.global.reset} />
        </p>
        <hr />
        <small>{t.cards.pipelineStage}</small>
        <List component="filter">
          {Object.keys(pipelineStages).map(pipelineStage => {
            {
              /*const filterValue = pipelineStage.value.split(' (')[0]*/
            }
            const filter = _.filter(allItems, { stage: pipelineStage }).length
            if (filter) {
              const stageApplied =
                typeof pipelineFilters.stage !== 'undefined' &&
                pipelineFilters.stage !== undefined &&
                pipelineFilters.stage == pipelineStage
                  ? true
                  : false
              const linkAttrs = this.getLinkAttrs(
                pipelineStages[pipelineStage],
                '#',
                stageApplied,
                pipelineStage,
                'stage'
              )
              const name = `${pipelineStage} (${filter})`
              return <ListItem {...linkAttrs} primaryText={name} />
            }
          })}
          {pipelineArchived.length > 0 && !hideStage && (
            <ListItem
              primaryText={`${t.pipeline.archive} (${pipelineArchived.length})`}
              onClick={showArchived}
              className={`showArchivedState ${showArchivedState ? 'selected' : ''}`}
            />
          )}
        </List>

        <hr />

        <a
          href={`#${t.global.hide}`}
          className={hideStage === false ? '' : hideStage}
          onClick={showHide}
        >
          {t.pipeline.hide}
        </a>
      </div>
    )
  }
}

export default PipelineFilters
