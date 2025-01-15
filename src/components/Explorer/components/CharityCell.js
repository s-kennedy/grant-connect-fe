import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, IconButton, Paper } from 'material-ui'
import { Search, Check, UnfoldMore, Close, LocationOn } from 'material-ui-icons'
import { Col, Row } from 'react-flexbox-grid'
import { useTranslation } from 'react-i18next'
import GiftInfo from 'components/ProfileCard/components/GiftInfo'

const CharityCell = ({cell}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const [showModal, setShowModal] = useState(false)
  
  const handleClose = () => {
    setShowModal(false)
  }

  const handleOpen = (e) => {
    setShowModal(true)
  }

  const giftInfos = [
    { label: "Recipient Size", value: 942000 },
    { label: t.cards.giftsLastYear, value: 99000 }
  ]

  return (
    <div>
      <div className="ge-table-cell tw-inline-flex tw-gap-1">
        {cell.getValue()}
        <IconButton className="ge-icon-button" onClick={handleOpen}><div className="tw-rotate-45"><Search /></div></IconButton>
      </div>
      <Dialog
        open={showModal}
        onClose={handleClose}
        onRequestClose={handleClose}
        onBackdropClick={handleClose}
        className="Explorer"
      >
        <div className="">
          <React.Fragment>
          <Paper className={`Full-card green`}>
            <Row>
              <Col xs={12}>
                <Row>
                  <Col xs={12}>
                    <h1 className="tw-text-xl">{cell.getValue()}</h1>
                  </Col>
                  <Col xs={12}>
                    <small className="Full-card__type tw-text-sm">{"Registered charity"}</small>
                    {"websiteUrl" && (
                      <FlatButton
                        className="Full-card__website"
                        label={"Website"}
                        onClick={() => window.open("/")}
                      />
                    )}
                  </Col>
                </Row>

                <Row>
                  <GiftInfo giftInfos={giftInfos} />
                </Row>

                <Row>
                  <Col xs={12}>
                    <div className="Full-card__open-to-requests">
                      <div className="tw-flex tw-items-center tw-mt-2">
                        <LocationOn /> <small className="tw-text-sm"> Location: Kitchener, ON </small>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12}>
                    <p className="tw-text-lg">The Kitchener-Waterloo Art Gallery is the oldest, largest collecting public art gallery in Waterloo Region, and has grown from a small, locally-focused volunteer organization to a major force in the Canadian art world. From its humble beginnings in a bicycle shed beside KW Collegiate, to the Gallery's present purpose-built accommodation in the Centre In The Square, the Gallery is setting a new direction for the visual arts in Waterloo Region and beyond.</p>
                  </Col>
                </Row>
              </Col>

              <Col xs={12}>
                <Row>
                  <Col xs={12}>
                    <div className="tw-flex tw-items-center tw-justify-end tw-gap-1 tw-mt-4 tw-pb-2">
                      <FlatButton
                        className="Full-card__status button-primary"
                        spinnerColor="white"
                        labelPosition="before"
                        label="Full Profile"
                        onClick={handleClose}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Paper>
        </React.Fragment>
        </div>
      </Dialog>
    </div>
  )
}

export default CharityCell
