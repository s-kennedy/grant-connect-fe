export const calculateVisiblePageNumbers = ({ pagerSize, currentPage, totalPages }) => {
  const size = pagerSize >= totalPages ? totalPages : pagerSize

  // current page is the first page
  if (currentPage === 1) {
    return Array(size)
      .fill()
      .map((_, idx) => idx + 1)
  }

  // current page is the last page
  if (currentPage === totalPages) {
    return Array(size)
      .fill()
      .map((_, idx) => totalPages - size + 1 + idx)
  }

  // current page is somewhere in the middle
  const endNumber = currentPage + (pagerSize - 1) / 2
  const end = endNumber > totalPages ? totalPages : endNumber
  const startNumber = currentPage - (pagerSize - 1) / 2
  const start = startNumber < 1 ? 1 : startNumber
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx)
}
