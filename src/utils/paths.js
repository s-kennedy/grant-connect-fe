const UrlPathObject = window.location.pathname.split('/')
const pathLanguage = UrlPathObject[1] === 'fr' ? '/fr' : ''

export const BASE_PAGE = `${pathLanguage}/`
export const SEARCH_PAGE = `${pathLanguage}/search`
export const PROFILE_PAGE = `${pathLanguage}/profile`
export const PIPELINE_PAGE = `${pathLanguage}/pipeline`
export const GIFT_PAGE = `${pathLanguage}/gift`
export const CONTACT_PAGE = `${pathLanguage}/contact`
export const LOGIN = `${pathLanguage}/login`
export const LOGOUT = `${pathLanguage}/logout`
export const RESET_PASSWORD = `${pathLanguage}/reset-password`
export const USER_PROFILE = `${pathLanguage}/user-profile/edit`
