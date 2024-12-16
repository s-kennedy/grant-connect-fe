import { RoleEnum } from 'store/reducers/user'

export const selectUser = ({ user }) => user

export const selectRole = ({ user: { role } }) => role

export const selectHasExecutePermissions = ({ user: { role } }) =>
  [RoleEnum.ESSENTIAL, RoleEnum.PREMIUM].includes(role)

export const selectUserOganization = ({ user: { organization } }) => organization

export const selectIsLibraryMode = ({ user: { isLibraryMode } }) => isLibraryMode

export const selectSession = ({ user: { session } }) => session
