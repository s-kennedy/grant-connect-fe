import { calculateVisiblePageNumbers } from './helpers'

describe('calculateVisiblePageNumbers:', () => {
  it('should return a correct array when current page is first', () => {
    const visiblePageNumbers = calculateVisiblePageNumbers({
      pagerSize: 3,
      currentPage: 1,
      totalPages: 10
    })
    expect(visiblePageNumbers).toEqual([1, 2, 3])
  })

  it('should return a correct array when current page is in the middle', () => {
    const visiblePageNumbers = calculateVisiblePageNumbers({
      pagerSize: 3,
      currentPage: 4,
      totalPages: 10
    })
    expect(visiblePageNumbers).toEqual([3, 4, 5])
  })

  it('should return a correct array when current page is the last', () => {
    const visiblePageNumbers = calculateVisiblePageNumbers({
      pagerSize: 3,
      currentPage: 10,
      totalPages: 10
    })
    expect(visiblePageNumbers).toEqual([8, 9, 10])
  })

  it('should return a correct array when there are only 2 pages', () => {
    const visiblePageNumbers = calculateVisiblePageNumbers({
      pagerSize: 5,
      currentPage: 1,
      totalPages: 2
    })
    expect(visiblePageNumbers).toEqual([1, 2])
  })
  it('should return a correct array when there are only 2 pages', () => {
    const visiblePageNumbers = calculateVisiblePageNumbers({
      pagerSize: 5,
      currentPage: 2,
      totalPages: 2
    })
    expect(visiblePageNumbers).toEqual([1, 2])
  })

  it('should return a correct array with 4 total pages and current page 2', () => {
    const visiblePageNumbers = calculateVisiblePageNumbers({
      pagerSize: 5,
      currentPage: 2,
      totalPages: 4
    })
    expect(visiblePageNumbers).toEqual([1, 2, 3, 4])
  })

  it('should return a correct array with 4 total pages and current page 3', () => {
    const visiblePageNumbers = calculateVisiblePageNumbers({
      pagerSize: 5,
      currentPage: 3,
      totalPages: 4
    })
    expect(visiblePageNumbers).toEqual([1, 2, 3, 4])
  })
})
