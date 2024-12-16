const defaultResults = []

export const selectSearchResults = ({ search: { results } }) => results || defaultResults
export const selectResultCount = ({ search: { count } }) => count
export const selectSearchText = ({ search: { text } }) => text
