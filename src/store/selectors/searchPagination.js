export const selectPaginationState = ({ searchPagination }) => searchPagination
export const selectViewsPerPage = ({ searchPagination: { viewsPerPage } }) => viewsPerPage
export const selectCurrentPage = ({ searchPagination: { pageNumber } }) => pageNumber
