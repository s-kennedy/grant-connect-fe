export const OPEN_TO_REQUESTS_OPTIONS = ({ t }) => [
  { value: 'all', label: t.global.all },
  { value: 'yes', label: t.global.yes },
  { value: 'no', label: t.global.no },
  { value: 'unknown', label: t.global.unknown }
]

export const isOpenToRequestsUnknown = (openToRequests, t) => {
  const items = OPEN_TO_REQUESTS_OPTIONS({ t })
  return openToRequests === items[3].value ? true : false
}
