// Global DOM components.
import React, { Component } from 'react'
import { IconButton } from 'material-ui'
import { ViewStream, ViewList } from 'material-ui-icons'

// App Language.
import { getLanguage } from 'data/locale'

// Custom components
import PipelineDownloadButton from '../../../components/PipelineDownloadButton'

const pipelineViews = {
  EXPANDED: 'expanded',
  COLLAPSED: 'collapsed'
}

class SearchPageViewChanger extends Component {
  state = {
    url: '#'
  }

  render() {
    const { onClick, collapsedActive, expandedActive, pipelineData, download } = this.props
    const { t } = getLanguage()

    return (
      <div className="Search-page__view Search-page__view">
        <PipelineDownloadButton
          pipelineData={pipelineData}
          download={download}
          className={`Search-page__view active Search-page__view-expanded`}
        />

        {/* Expanded Cards view icon */}
        <IconButton
          data-tip={t.search.view.cards}
          className={`Search-page__view Search-page__view-expanded ${expandedActive}`}
          onClick={() => onClick(pipelineViews.EXPANDED)}
        >
          <ViewStream />
        </IconButton>
        {/* ENDOF: Expanded Cards view icon */}

        {/* Collapsed Cards view icon */}
        <IconButton
          data-tip={t.search.view.table}
          className={`Search-page__view Search-page__view-collapsed ${collapsedActive}`}
          onClick={() => onClick(pipelineViews.COLLAPSED)}
        >
          <ViewList />
        </IconButton>
        {/* ENDOF: Collapsed Cards view icon */}
      </div>
    )
  }
}

export default SearchPageViewChanger
