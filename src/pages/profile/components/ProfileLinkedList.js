import React from 'react'
import TextLoading from '../../../components/global/loading/TextLoading'

function ProfileLinkedList(props) {
  const { headerTitle, RenderElement, termData } = props

  return (
    <div className="profile-info-wrapper">
      <h4>{headerTitle}</h4>
      {typeof termData === 'undefined' && <TextLoading />}
      {Array.isArray(termData) &&
        termData.map(term => {
          return (
            <RenderElement key={term.id} className="profile-programs-regions-item">
              <a href={`/profile/${term.id}`}>{term.name}</a>
            </RenderElement>
          )
        })}
    </div>
  )
}

export default ProfileLinkedList
