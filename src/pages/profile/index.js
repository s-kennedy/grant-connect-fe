import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Row } from 'react-flexbox-grid'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import { isOpenToRequestsUnknown } from 'components/OpenToRequestsSelect/helpers'

import ReportProfileError from './components/ReportProfileError'
import ProfileCard from 'components/ProfileCard'
import DissolvedProfileCard from 'components/ProfileCard/DissolvedProfileCard'
import ProfileAbout from 'components/ProfileAbout'
import ProfilePrograms from 'components/ProfilePrograms'
import ProfileGifts from 'components/ProfileGifts'

import { getFunderById } from 'store/actions/profile'
import { getNotesByFunderId } from 'store/actions/notes'
import { getPipelineStages } from 'store/actions/pipelineStages'
import {
  getGiftHistoryCancelSource,
  resetPaginatedGiftHistory,
  getFunderPaginatedGiftHistory,
  DEFAULT_PAGINATION_PARAMS
} from 'store/actions/giftHistory'
import {
  selectFunderProfileInfo,
  selectIsFunderProfileDissolved,
  selectIsFunderProfileLoading
} from 'store/selectors/profile'
import { getLongFormatDate } from 'utils/dates'
import { selectIsLibraryMode } from 'store/selectors/user'

const ProfilePage = ({}) => {
  const dispatch = useDispatch()
  const { profileId } = useParams()
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const isLoading = useSelector(selectIsFunderProfileLoading)
  const isFunderDissolved = useSelector(selectIsFunderProfileDissolved)
  const GiftCancelSource = getGiftHistoryCancelSource()
  const { funderPrograms, updatedAt, openToRequests, hasGifts } = useSelector(
    selectFunderProfileInfo
  )
  const isLibraryMode = useSelector(selectIsLibraryMode)

  const isUnknown = isOpenToRequestsUnknown(openToRequests, t)
  const showPrograms = Array.isArray(funderPrograms) && funderPrograms.length && !isUnknown

  const formattedLastUpdated = !!updatedAt && getLongFormatDate(updatedAt)

  useEffect(() => {
    dispatch(getFunderById(profileId))
    dispatch(
      getFunderPaginatedGiftHistory(
        GiftCancelSource,
        profileId,
        DEFAULT_PAGINATION_PARAMS.resultsPerPage,
        DEFAULT_PAGINATION_PARAMS.currentPage,
        DEFAULT_PAGINATION_PARAMS.filterYear,
        DEFAULT_PAGINATION_PARAMS.filterFocus,
        DEFAULT_PAGINATION_PARAMS.fromGiftValue,
        DEFAULT_PAGINATION_PARAMS.toGiftValue,
        DEFAULT_PAGINATION_PARAMS.sortField,
        DEFAULT_PAGINATION_PARAMS.sortDirection
      )
    )

    if (!isLibraryMode) {
      dispatch(getPipelineStages())
      dispatch(getNotesByFunderId(profileId))
    }

    return () => {
      dispatch(resetPaginatedGiftHistory(GiftCancelSource))
    }
  }, [profileId])

  return (
    <div>
      <Row>
        <ReportProfileError />
      </Row>
      <Row>{isFunderDissolved ? <DissolvedProfileCard /> : <ProfileCard />}</Row>
      {!!formattedLastUpdated && (
        <div className="profile-last-updated">{`${t.funder.profileUpdated}: ${formattedLastUpdated}`}</div>
      )}
      {!isLoading && (
        <Tabs defaultIndex={0}>
          <TabList>
            <Tab>{t.funder.about}</Tab>
            {!isFunderDissolved && (
              <>
                {!!showPrograms && <Tab>{t.funder.programs}</Tab>}
                {!!hasGifts && <Tab>{t.funder.giftAnalysis}</Tab>}
              </>
            )}
          </TabList>
          <TabPanel className="row">
            <ProfileAbout />
          </TabPanel>
          {!isFunderDissolved && (
            <>
              {!!showPrograms && (
                <TabPanel className="row profile-programs">
                  <ProfilePrograms />
                </TabPanel>
              )}
              {!!hasGifts && (
                <TabPanel className="row">
                  <ProfileGifts />
                </TabPanel>
              )}
            </>
          )}
        </Tabs>
      )}
    </div>
  )
}

export default ProfilePage
