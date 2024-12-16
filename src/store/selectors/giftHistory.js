export const selectIsFunderGiftDataLoading = ({ funderGiftHistory: { isLoading } }) => isLoading
export const selectIsFunderPaginatedGiftDataLoading = pageNumber => ({
  funderGiftHistory: { isPaginatedLoading }
}) => {
  return isPaginatedLoading[pageNumber]
}

export const selectFunderPaginatedGiftHistoryPage = pageNumber => ({ funderGiftHistory }) => ({
  paginatedResults:
    funderGiftHistory.paginatedResults[pageNumber] === undefined
      ? []
      : funderGiftHistory.paginatedResults[pageNumber].map(item => {
          const region =
            (item.charity &&
              Array.isArray(item.charity.charityRegions) &&
              item.charity.charityRegions.length &&
              item.charity.charityRegions[0].name) ||
            ''

          return { ...item, region }
        }),
  totalCount: funderGiftHistory.paginatedTotalCount
})
