// Global DOM components.
import * as locationSearch from 'query-string'

// API calls.
import * as GrantConnectAPI from '../utils/API/ContentaAPI-DEPRECATED'

// Helpers.
// import { getFormattedDateFromTimestamp } from '../utils/helpers'

// App Language.
import { getLanguage } from 'data/locale'
import _ from 'lodash'

export const getFunderGiftByCause = nid => {
  return GrantConnectAPI.getFunderGiftByCause(nid)
}

export const getFunderGiftByRegion = nid => {
  return GrantConnectAPI.getFunderGiftByRegion(nid)
}

export const getFunderInfoByUuid = uuid => {
  return GrantConnectAPI.getFunderInfoByUuid(uuid)
}

export const getFunderNotes = nid => {
  return GrantConnectAPI.getFunderNotes(nid)
}

export const formatNotes = notes => {
  let notesItems = []
  let itemsToDisplay = []

  for (let noteIndex in notes.data) {
    let note = notes.data[noteIndex]
    var time_string = note.attributes.changed.split('T')
    var changed_date = new Date(time_string[0])
    notesItems.push({
      id: note.id,
      // date: getFormattedDateFromTimestamp(new Date(changed_date.getTime())),
      note: note.attributes.comment_body.value
    })
  }

  itemsToDisplay = notesItems.slice(0, 2)

  return { data: { items: notesItems, itemsToDisplay } }
}

export const getCardsActionsOptions = () => {
  return GrantConnectAPI.getCardsActionsOptions()
}

export const formatCardsActionsOptions = flags => {
  return flags.data
}

export const getAllRoles = () => {
  return GrantConnectAPI.getAllRoles()
}

export const getRelatedData = apiUrl => {
  return GrantConnectAPI.getRelatedData(apiUrl)
}

export const formatPositions = (positions, roles) => {
  let funderPositions = []
  let groupedFunderPositions = []

  positions.data.map(position => {
    const funderPosition = position.attributes.position !== null ? position.attributes.position : ''
    const funderPositionName =
      position.attributes.name !== null ? position.attributes.name.value : ''
    let funderPositionRole

    if (position.relationships.role.data !== null) {
      funderPositionRole = position.relationships.role.data
    }

    if (funderPositionName !== '') {
      funderPositions.push({
        id: position.id,
        name: funderPositionName,
        position: funderPosition,
        ceasedDate: position.attributes.ceased_date,
        roleIds: funderPositionRole
      })
    }

    return funderPositions
  })

  for (let roleIndex in funderPositions) {
    for (let roleId in funderPositions[roleIndex].roleIds) {
      groupedFunderPositions.push({
        role: getRoleNameFromRoleId(
          funderPositions[roleIndex].roleIds[roleId].id,
          roles,
          funderPositions[roleIndex].ceasedDate
        ),
        data: funderPositions[roleIndex]
      })
    }
  }

  // Grouping the results by Role.
  let groupedFunderPositionsByRole = groupedFunderPositions.reduce(function (r, a) {
    r[a.role] = r[a.role] || []
    r[a.role].push(a)
    return r
  }, Object.create(null))

  return groupedFunderPositionsByRole
}

const getRoleNameFromRoleId = (roleIds, roles, ceasedDate) => {
  let roleName = ''
  const { t } = getLanguage()

  roles.data.forEach(role => {
    if (roleIds === role.id) {
      roleName =
        ceasedDate === null
          ? `${role.attributes.name}s`
          : `${t.funder.past} ${role.attributes.name}s`
    }
  })

  return roleName
}

export const getGiftData = (funderId, offset, results, sort_field, sort_direction) => {
  return GrantConnectAPI.getGiftData(funderId, offset, results, sort_field, sort_direction)
}

export const getGiftDataWithArguments = args => {
  return GrantConnectAPI.getGiftDataWithArguments(args)
}

export const getFinancialData = funderId => {
  return GrantConnectAPI.getFinancialData(funderId)
}

export const getPagerInfo = (funderId, queryStrings) => {
  let queryArguments = { funder: funderId }
  if (typeof queryStrings['filter[year][value]'] !== 'undefined') {
    queryArguments = {
      ...queryArguments,
      year: queryStrings['filter[year][value]']
    }
  }

  // if (typeof queryStrings["filter[cause][condition][value][]"] !== "undefined") {
  //   queryArguments = {
  //     ...queryArguments,
  //     cause: queryStrings["filter[cause][condition][value][]"][0]
  //   };
  // }

  // if (typeof queryStrings["filter[cause][condition][value][0]"] !== "undefined") {
  //   queryArguments = {
  //     ...queryArguments,
  //     cause: queryStrings["filter[cause][condition][value][0]"]
  //   };
  // }

  if (typeof queryStrings['filter[amount][condition][value][]'] !== 'undefined') {
    if (queryStrings['filter[amount][condition][operator]'] === 'BETWEEN') {
      queryArguments = {
        ...queryArguments,
        size_min: queryStrings['filter[amount][condition][value][]'][0],
        size_max: queryStrings['filter[amount][condition][value][]'][1]
      }
    } else if (queryStrings['filter[amount][condition][operator]'] === '>') {
      queryArguments = {
        ...queryArguments,
        size_min: queryStrings['filter[amount][condition][value][]'][0]
      }
    } else {
      queryArguments = {
        ...queryArguments,
        size_max: queryStrings['filter[amount][condition][value][]'][0]
      }
    }
  }
  let newQueryString = locationSearch.stringify(queryArguments)
  if (typeof queryStrings['filter[cause][condition][value][]'] !== 'undefined') {
    newQueryString += '&cause=' + queryStrings['filter[cause][condition][value][]'].join(',')
  }
  return GrantConnectAPI.getPagerInfo(newQueryString)
}

export const getOpportunity = nid => {
  return GrantConnectAPI.getOpportunity(nid)
}

export const getAllStages = () => {
  return GrantConnectAPI.getAllStages()
}

export const updateRequestSize = (
  requestSize,
  funderId,
  opportunityId,
  flagId,
  pipelineStageId
) => {
  GrantConnectAPI.getUserInfo().then(user => {
    const flag =
      flagId.trim().length === 0
        ? { data: null }
        : { data: { type: 'taxonomy_term--flag', id: `${flagId}` } }

    const updatedOpportunity = {
      attributes: {
        request_size: `${requestSize}`
      },
      relationships: {
        uid: {
          data: {
            type: 'user--user',
            id: user[0].uuid
          }
        },
        funder: {
          data: {
            type: 'node--funder',
            id: funderId
          }
        },
        flag: flag,
        pipeline_stage: {
          data: {
            type: 'taxonomy_term--pipeline_stage',
            id: `${pipelineStageId}`
          }
        }
      },
      type: 'node--opportunity',
      id: opportunityId
    }

    GrantConnectAPI.updateOpportunity(updatedOpportunity)
  })
}

export const updateStage = (funderId, opportunityId, flagId, pipelineStageId) => {
  return GrantConnectAPI.getUserInfo().then(user => {
    const flag =
      flagId.trim().length === 0
        ? { data: null }
        : { data: { type: 'taxonomy_term--flag', id: `${flagId}` } }

    const updatedOpportunity = {
      relationships: {
        uid: {
          data: {
            type: 'user--user',
            id: user[0].uuid
          }
        },
        funder: {
          data: {
            type: 'node--funder',
            id: funderId
          }
        },
        flag: flag,
        pipeline_stage: {
          data: {
            type: 'taxonomy_term--pipeline_stage',
            id: `${pipelineStageId}`
          }
        }
      },
      type: 'node--opportunity',
      id: opportunityId
    }

    return GrantConnectAPI.updateOpportunity(updatedOpportunity)
  })
}

export const createOpportunity = (funderId, pipelineStageId) => {
  return GrantConnectAPI.getUserInfo().then(user => {
    const opportunity = {
      attributes: {
        title: `${funderId}${pipelineStageId}`
      },
      relationships: {
        uid: {
          data: {
            type: 'user--user',
            id: user[0].uuid
          }
        },
        funder: {
          data: {
            type: 'node--funder',
            id: funderId
          }
        },
        flag: { data: null },
        pipeline_stage: {
          data: {
            type: 'taxonomy_term--pipeline_stage',
            id: `${pipelineStageId}`
          }
        }
      },
      type: 'node--opportunity'
    }

    return GrantConnectAPI.createOpportunity(opportunity)
  })
}

export const createOpportunityWithFlag = (funderId, flagId) => {
  return GrantConnectAPI.getUserInfo().then(user => {
    const opportunity = {
      attributes: {
        title: `${funderId}${flagId}`
      },
      relationships: {
        uid: {
          data: {
            type: 'user--user',
            id: user[0].uuid
          }
        },
        funder: {
          data: {
            type: 'node--funder',
            id: funderId
          }
        },
        flag: {
          data: {
            type: 'taxonomy_term--flag',
            id: `${flagId}`
          }
        },
        pipeline_stage: { data: null }
      },
      type: 'node--opportunity'
    }

    return GrantConnectAPI.createOpportunity(opportunity)
  })
}

export const updateOpportunityFlag = (opportunityId, funderId, flagId) => {
  return GrantConnectAPI.getUserInfo().then(user => {
    const updatedOpportunity = {
      relationships: {
        uid: {
          data: {
            type: 'user--user',
            id: user[0].uuid
          }
        },
        funder: {
          data: {
            type: 'node--funder',
            id: funderId
          }
        },
        flag: {
          data: {
            type: 'taxonomy_term--flag',
            id: `${flagId}`
          }
        }
      },
      type: 'node--opportunity',
      id: opportunityId
    }

    return GrantConnectAPI.updateOpportunity(updatedOpportunity)
  })
}

export const resetOpportunity = (opportunityId, funderId) => {
  return GrantConnectAPI.getUserInfo().then(user => {
    const updatedOpportunity = {
      relationships: {
        uid: {
          data: {
            type: 'user--user',
            id: user[0].uuid
          }
        },
        funder: {
          data: {
            type: 'node--funder',
            id: funderId
          }
        },
        flag: { data: null },
        pipeline_stage: { data: null }
      },
      type: 'node--opportunity',
      id: opportunityId
    }

    return GrantConnectAPI.updateOpportunity(updatedOpportunity)
  })
}

export const updateNote = (noteId, value) => {
  const updatedNote = {
    attributes: {
      comment_body: { value: value }
    },
    type: 'comment--note',
    id: noteId
  }

  GrantConnectAPI.updateNote(updatedNote, noteId)
}

export const deleteNote = noteId => {
  const updatedNote = {
    attributes: {
      status: 0
    },
    type: 'comment--note',
    id: noteId
  }

  return GrantConnectAPI.deleteNote(updatedNote, noteId)
}

export const createNote = (opportunityId, value) => {
  return GrantConnectAPI.getUserInfo().then(user => {
    const newNote = {
      attributes: {
        comment_body: { value: value },
        entity_type: 'node',
        field_name: 'note'
      },
      relationships: {
        comment_type: {
          data: {
            type: 'comment_type--comment_type',
            id: 'd8e2346b-af5c-4187-bf5b-a70da177e640'
          }
        },
        entity_id: {
          data: {
            type: 'node--opportunity',
            id: `${opportunityId}`
          }
        }
      },
      type: 'comment--note'
    }

    return GrantConnectAPI.createNote(newNote)
  })
}
