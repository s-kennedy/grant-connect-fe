import { addFacetType } from 'utils/helpers'

export const selectFunderProfileInfo = ({ profile }) => profile
export const selectFunderPrecalculatedInfo = ({ profile }) => profile.precalculated

export const selectIsFunderProfileDissolved = ({ profile: { status } }) => status === 'dissolved'
export const selectIsFunderProfileLoading = ({ profile: { isLoading } }) => isLoading
export const selectFunderPills = ({
  profile: {
    funderCauses = [],
    funderPopulations = [],
    funderRegions = [],
    funderInternationals = [],
    funderActivityOption = []
  }
}) => [
  ...addFacetType(funderCauses, 'causes'),
  ...addFacetType(funderPopulations, 'populations'),
  ...addFacetType(funderRegions, 'regions'),
  ...addFacetType(funderInternationals, 'internationals'),
  ...funderActivityOption
]

export const selectFunderProfileCategory = ({ profile: { primaryCategory } }) =>
  primaryCategory
    ? primaryCategory.root && primaryCategory.root.id !== primaryCategory.id
      ? `${primaryCategory.name}/${primaryCategory.root.name}`
      : primaryCategory.name
    : null
