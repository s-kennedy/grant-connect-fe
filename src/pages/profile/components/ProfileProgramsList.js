import React from 'react'
import TextLoading from '../../../components/global/loading/TextLoading'

function ProfileProgramsList(props) {
  const { headerTitle, RenderElement, termData, description } = props
  return (
    <div className="profile-info-wrapper">
      <h5>{headerTitle}</h5>
      {typeof termData === 'undefined' && <TextLoading />}
      {typeof description !== 'undefined' && description}
      {Array.isArray(termData) &&
        termData.length &&
        termData.map(term => {
          return (
            <RenderElement key={term.id} className="profile-programs-regions-item">
              {term.eligibleCost.name}
            </RenderElement>
          )
        })}
    </div>
  )
}

export default ProfileProgramsList
