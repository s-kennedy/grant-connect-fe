import { paginate } from 'utils/helpers'

describe('paginate:', () => {
  const pageNumber = 3
  const viewsPerPage = 10

  it('should add offset and query params to URL that does not have any', () => {
    const url = 'https://grant-connect-dev.herokuapp.com/api/search/funders/'
    const paginatedUrl = paginate({ url, pageNumber, viewsPerPage })
    expect(paginatedUrl).toEqual('https://grant-connect-dev.herokuapp.com/api/search/funders/?limit=10&offset=20')
  })
  it('should add offset and query params to URL when original URL already has query params', () => {
    const url = 'https://grant-connect-dev.herokuapp.com/api/search/funders/?foo=bar'
    const paginatedUrl = paginate({ url, pageNumber, viewsPerPage })
    expect(paginatedUrl).toEqual(
      'https://grant-connect-dev.herokuapp.com/api/search/funders/?foo=bar&limit=10&offset=20'
    )
  })
  it('should return original URL when offset and limit not given', () => {
    const url = 'https://grant-connect-dev.herokuapp.com/api/search/funders/'
    const paginatedUrl = paginate({ url })
    expect(paginatedUrl).toEqual(url)
  })
  it('should return original URL when offset and limit are 0', () => {
    const url = 'https://grant-connect-dev.herokuapp.com/api/search/funders/'
    const paginatedUrl = paginate({ url, pageNumber: 0, viewsPerPage: 0 })
    expect(paginatedUrl).toEqual(url)
  })
})
