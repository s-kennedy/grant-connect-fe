import React from 'react'
import { useSelector } from 'react-redux'
import { selectFunderProfileInfo } from 'store/selectors/profile'

const SpecialNote = () => {
  const { specialNote } = useSelector(selectFunderProfileInfo)

  return !!specialNote ? (
    <div className="profile-special-notes">
      <div className="profile-special-notes-note">
        <p dangerouslySetInnerHTML={{ __html: specialNote }} />
      </div>
    </div>
  ) : null
}

export default SpecialNote
