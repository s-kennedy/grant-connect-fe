import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatButton, List, ListItem } from 'material-ui'
import _ from 'lodash'

const PipelineFilters = ({
  pipelineStages,
  counts,
  pipelineFilter,
  applyFilter,
  showOnlyHidden,
  setShowOnlyHidden,
  archivedCount,
  archivedFilter,
  setArchivedFilter
}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const resetFilters = () => {
    applyFilter(null)
    setShowOnlyHidden(false)
  }

  if (!pipelineStages) {
    return null;
  }

  return (
    <div className="Pipeline__filters">
      <p>
        <small>{t.search.filters}</small>
        {(pipelineFilter || showOnlyHidden) && <FlatButton onClick={resetFilters} label={t.global.reset} />}
      </p>
      <hr />
      <small>{t.cards.pipelineStage}</small>
      <List component="filter">
        {pipelineStages.map(pipelineStage => {
          const count = counts[pipelineStage.id] && counts[pipelineStage.id].length || 0
          if (count) {
            return <ListItem
              key={pipelineStage.id}
              href="#"
              primaryText={`${pipelineStage.name} (${count})`}
              className={pipelineFilter === pipelineStage.id ? 'selected' : ''}
              onClick={(e) => {
                e.preventDefault()
                if (pipelineFilter === pipelineStage.id) applyFilter(null)
                else applyFilter(pipelineStage.id)
              }}
            />
          }
        })}
        <ListItem
          href="#"
          primaryText={`${t.pipeline.archive} (${archivedCount})`}
          className={archivedFilter ? 'selected' : ''}
          onClick={(e) => {
            e.preventDefault()
            if (archivedFilter) applyFilter(null)
            else setArchivedFilter()
          }}
        />
      </List>

      <hr />

      <a
        href={`#${t.global.hide}`}
        className={showOnlyHidden ? 'displayHidden' : ''}
        onClick={(e) => {
          e.preventDefault()
          setShowOnlyHidden(!showOnlyHidden)
        }}>
        {t.pipeline.hide}
      </a>
    </div>
  )
}

export default PipelineFilters
