// Global DOM Components.
import React, { Component } from 'react'
import { Checkbox, IconButton, Dialog, FlatButton, Menu, MenuItem, Popover } from 'material-ui'
import { Close, MoreVert } from 'material-ui-icons'

// Helpers.
import _ from 'lodash'

// Controllers.
import * as FunderController from '../../../controllers/FunderController-DEPRECATED'

// Custom CSS.
import './CardsActions.css'

// App Language.
import { getLanguage } from 'data/locale'

// Paths.
import { PROFILE_PAGE } from '../../../utils/paths'

// example from staging app's local storage
const mockActionsOptions = [
  {
    type: 'taxonomy_term--flag',
    id: '4e1f4de2-4337-4ede-92ae-b21619453e0b',
    links: {
      self: {
        href:
          'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4e1f4de2-4337-4ede-92ae-b21619453e0b'
      }
    },
    attributes: {
      drupal_internal__tid: 37774,
      drupal_internal__revision_id: 37774,
      langcode: 'en',
      revision_created: null,
      revision_log_message: null,
      status: true,
      name: 'Hide',
      description: null,
      weight: 1,
      changed: '2018-03-01T16:59:23+00:00',
      default_langcode: true,
      revision_translation_affected: true,
      content_translation_source: 'und',
      content_translation_outdated: false,
      content_translation_created: '2018-01-15T18:52:09+00:00'
    },
    relationships: {
      vid: {
        data: {
          type: 'taxonomy_vocabulary--taxonomy_vocabulary',
          id: '63a0fc63-b6b9-4261-8b04-1776cf192231'
        },
        links: {
          related: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4e1f4de2-4337-4ede-92ae-b21619453e0b/vid'
          },
          self: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4e1f4de2-4337-4ede-92ae-b21619453e0b/relationships/vid'
          }
        }
      },
      revision_user: {
        data: null,
        links: {
          related: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4e1f4de2-4337-4ede-92ae-b21619453e0b/revision_user'
          },
          self: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4e1f4de2-4337-4ede-92ae-b21619453e0b/relationships/revision_user'
          }
        }
      },
      parent: {
        data: [
          {
            type: 'taxonomy_term--flag',
            id: 'virtual',
            meta: {
              links: {
                help: {
                  href: 'https://www.drupal.org/docs/8/modules/json-api/core-concepts#virtual',
                  meta: { about: "Usage and meaning of the 'virtual' resource identifier." }
                }
              }
            }
          }
        ],
        links: {
          related: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4e1f4de2-4337-4ede-92ae-b21619453e0b/parent'
          },
          self: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4e1f4de2-4337-4ede-92ae-b21619453e0b/relationships/parent'
          }
        }
      },
      content_translation_uid: {
        data: { type: 'user--user', id: '1ce96191-85ce-4aea-a84e-bba84651b969' },
        links: {
          related: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4e1f4de2-4337-4ede-92ae-b21619453e0b/content_translation_uid'
          },
          self: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4e1f4de2-4337-4ede-92ae-b21619453e0b/relationships/content_translation_uid'
          }
        }
      }
    }
  },
  {
    type: 'taxonomy_term--flag',
    id: '4b0d6dc6-aa77-4ba6-8ef2-20f82d6d7d79',
    links: {
      self: {
        href:
          'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4b0d6dc6-aa77-4ba6-8ef2-20f82d6d7d79'
      }
    },
    attributes: {
      drupal_internal__tid: 38240,
      drupal_internal__revision_id: 38240,
      langcode: 'en',
      revision_created: null,
      revision_log_message: null,
      status: true,
      name: 'Reset',
      description: null,
      weight: 0,
      changed: '2018-03-08T14:19:00+00:00',
      default_langcode: true,
      revision_translation_affected: true,
      content_translation_source: 'und',
      content_translation_outdated: false,
      content_translation_created: '2018-03-06T02:19:36+00:00'
    },
    relationships: {
      vid: {
        data: {
          type: 'taxonomy_vocabulary--taxonomy_vocabulary',
          id: '63a0fc63-b6b9-4261-8b04-1776cf192231'
        },
        links: {
          related: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4b0d6dc6-aa77-4ba6-8ef2-20f82d6d7d79/vid'
          },
          self: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4b0d6dc6-aa77-4ba6-8ef2-20f82d6d7d79/relationships/vid'
          }
        }
      },
      revision_user: {
        data: null,
        links: {
          related: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4b0d6dc6-aa77-4ba6-8ef2-20f82d6d7d79/revision_user'
          },
          self: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4b0d6dc6-aa77-4ba6-8ef2-20f82d6d7d79/relationships/revision_user'
          }
        }
      },
      parent: {
        data: [
          {
            type: 'taxonomy_term--flag',
            id: 'virtual',
            meta: {
              links: {
                help: {
                  href: 'https://www.drupal.org/docs/8/modules/json-api/core-concepts#virtual',
                  meta: { about: "Usage and meaning of the 'virtual' resource identifier." }
                }
              }
            }
          }
        ],
        links: {
          related: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4b0d6dc6-aa77-4ba6-8ef2-20f82d6d7d79/parent'
          },
          self: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4b0d6dc6-aa77-4ba6-8ef2-20f82d6d7d79/relationships/parent'
          }
        }
      },
      content_translation_uid: {
        data: { type: 'user--user', id: 'd75d8d25-6184-4df2-becf-dca23d753bc4' },
        links: {
          related: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4b0d6dc6-aa77-4ba6-8ef2-20f82d6d7d79/content_translation_uid'
          },
          self: {
            href:
              'https://www.beta.grantconnect.ca/jsonapi/taxonomy_term/flag/4b0d6dc6-aa77-4ba6-8ef2-20f82d6d7d79/relationships/content_translation_uid'
          }
        }
      }
    }
  }
]

class CardsActions extends Component {
  state = {
    showExpandedCardActionsMenu: {},
    actionsOptions: mockActionsOptions,
    dontShowChecked: false,
    modalOpened: false,
    selectedFlag: null,
    selectedFlagName: 'Hide'
  }

  componentDidMount() {
    // const language = getLanguage()
    // if (typeof localStorage['actionsOptions' + language] === 'undefined') {
    //   FunderController.getCardsActionsOptions().then(flags => {
    //     const actionsOptions = FunderController.formatCardsActionsOptions(flags)
    //     localStorage.setItem('actionsOptions' + language, JSON.stringify(actionsOptions))
    //     this.setState({ actionsOptions })
    //   })
    // } else {
    //   this.setState({ actionsOptions: JSON.parse(localStorage['actionsOptions' + language]) })
    // }
  }

  handleActionsClick = (e, index) => {
    this.setState({
      showExpandedCardActionsMenu: { [index]: true },
      anchorEl: e.currentTarget
    })

    e.preventDefault()
  }

  handleRequestClose = () => {
    this.setState({ showExpandedCardActionsMenu: {} })
  }

  shouldOpenModal = (flagId, flagName) => {
    this.setState({
      modalOpened: localStorage[`dontShowChecked${flagName}`] !== 'true',
      selectedFlag: flagId,
      selectedFlagName: flagName
    })

    if (localStorage[`dontShowChecked${flagName}`] === 'true') {
      this.updateFlag(flagName, flagId)
    }

    this.handleRequestClose()
  }

  closeModal = () => {
    const { t } = getLanguage()
    this.setState({
      modalOpened: false,
      selectedFlag: null,
      selectedFlagName: t.global.hide
    })
  }

  updateFlag = (flagName, flagId) => {
    const { dontShowChecked, selectedFlag, selectedFlagName } = this.state
    const { funderId, opportunity } = this.props
    if (typeof flagId === 'undefined') {
      flagId = selectedFlag
    }
    // Create a localStorage variable to store the option to not show the
    // dialog when the user checkes the checkbox.
    if (dontShowChecked) {
      localStorage.setItem(`dontShowChecked${selectedFlagName}`, true)
      this.setState({ dontShowChecked: false })
    }

    this.closeModal()

    if (flagName === 'Reset' && typeof opportunity !== 'undefined') {
      FunderController.resetOpportunity(opportunity.uuid, funderId).then(opportunity => {
        window.location.reload()
      })
    } else {
      // If there's not opportunity yet, create one.
      if (typeof opportunity === 'undefined') {
        FunderController.createOpportunityWithFlag(funderId, flagId).then(opportunity => {
          window.location.reload()
        })
      } else {
        FunderController.updateOpportunityFlag(opportunity.uuid, funderId, flagId).then(
          opportunity => {
            if (_.has(opportunity, 'data')) {
              window.location.reload()
            }
          }
        )
      }
    }
  }

  updateDontShowCheck = () => {
    this.setState({ dontShowChecked: !this.state.dontShowChecked })
  }

  goToFunder = () => {
    const { history, funderId } = this.props
    history.push({ pathname: `${PROFILE_PAGE}/${funderId}` })
  }

  render() {
    const { actionsOptions, selectedFlagName } = this.state
    const { index, opportunity, status } = this.props
    const { t } = getLanguage()
    return (
      <div className="Material-cards-actions-wrapper">
        <IconButton
          className="Material-cards__expanded-actions"
          onClick={e => this.handleActionsClick(e, index)}
        >
          <MoreVert />
        </IconButton>
        <Popover
          open={this.state.showExpandedCardActionsMenu[index]}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <Menu className="Material-cards__expanded-actions-menu-wrapper">
            <IconButton onClick={this.handleRequestClose}>
              <Close />
            </IconButton>
            {typeof opportunity !== 'undefined' && status != 'Dissolved' && (
              <MenuItem
                className="Material-cards__expanded-actions-item"
                primaryText={t.cards.addNote}
                onClick={this.goToFunder}
              />
            )}
            {status != 'Dissolved' && <hr />}
            {actionsOptions.length > 0 &&
              actionsOptions.map((actionOption, actionIndex) => {
                // For roles other than 'licensed_version', show the change user, else hide it.
                const isLicencedUser = typeof localStorage.licensedUser !== 'undefined'

                // If this is the Hide or Reset option, and we are a licenced user, disable these options.
                if (
                  isLicencedUser &&
                  [37774, 38240].indexOf(actionOption.attributes.drupal_internal__tid) !== -1
                ) {
                  return null
                }

                return (
                  <MenuItem
                    key={actionIndex}
                    className="Material-cards__expanded-actions-item"
                    primaryText={actionOption.attributes.name}
                    onClick={() =>
                      this.shouldOpenModal(actionOption.id, actionOption.attributes.name)
                    }
                  />
                )
              })}
          </Menu>
        </Popover>
        <Dialog
          className="Profile-gift-analysis-dialog"
          title={
            this.state.selectedFlagName == 'Hide' || this.state.selectedFlagName == 'Masquer'
              ? t.cards.hideTitle
              : t.cards.resetTitle
          }
          actions={[
            <FlatButton
              key={1}
              label={this.state.selectedFlagName}
              onClick={() => this.updateFlag(this.state.selectedFlagName)}
            />,
            <FlatButton key={2} label={t.global.cancel} onClick={this.closeModal} />
          ]}
          open={this.state.modalOpened}
          onRequestClose={this.closeModal}
        >
          <p>
            {this.state.selectedFlagName !== 'Reset' ? t.cards.hideConfirm : t.cards.resetConfirm}
          </p>
          <Checkbox
            label={t.cards.noShow}
            checked={this.state.dontShowChecked}
            onCheck={this.updateDontShowCheck}
          />
        </Dialog>
      </div>
    )
  }
}

export default CardsActions
