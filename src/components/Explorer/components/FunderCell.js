import React, { useState, useEffect } from 'react'
import { Dialog, FlatButton, IconButton, Paper } from 'material-ui'
import { Search, Check, UnfoldMore, Close, LocationOn } from 'material-ui-icons'
import { Col, Row } from 'react-flexbox-grid'
import { useTranslation } from 'react-i18next'
import GiftInfo from 'components/ProfileCard/components/GiftInfo'

const FunderCell = ({cell}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
  const [showModal, setShowModal] = useState(false)
  
  
  const handleClose = () => {
    setShowModal(false)
  }

  const handleOpen = (e) => {
    setShowModal(true)
  }

  const inPipeline = cell.row.original.funder.pipeline
  const giftInfos = [
    { label: t.cards.giftsLastYear, value: 997000 },
    { label: t.cards.typicalGift, value: 23000 },
    { label: t.cards.typicalRecipientSize, value: 942000 }
  ]
  return (
    <div>
      <div className="ge-table-cell tw-inline-flex tw-gap-1">
        {cell.getValue()}
        <IconButton className="ge-icon-button" onClick={handleOpen}><div className=""><UnfoldMore style={{transform: "rotate(45deg)"}}/></div></IconButton>
        {inPipeline && <IconButton className="ge-icon-button ge-pipeline-button"><Check /></IconButton> }
      </div>
      <Dialog
        open={showModal}
        onClose={handleClose}
        onRequestClose={handleClose}
        onBackdropClick={handleClose}
        className="Explorer"
      >
        <React.Fragment>
          <Paper className={`Full-card yellow`}>
            <Row>
              <Col xs={12}>
                <Row>
                  <Col xs={12}>
                    <h1 className="tw-text-xl">{cell.getValue()}</h1>
                  </Col>
                  <Col xs={12}>
                    <small className="Full-card__type tw-text-sm">{"Local municipality/Government"}</small>
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
                        <small className="tw-text-sm">{`${t.funder.funderPrograms}: 1`}</small>
                        <Check />
                        <small className="tw-text-sm">Open to Requests</small>
                        <LocationOn /> <small className="tw-text-sm"> Headquarters: Halifax, NS </small>
                      </div>
                    </div>
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
                      <FlatButton
                        className="Full-card__status add"
                        spinnerColor="white"
                        labelPosition="before"
                        label="Add to Pipeline"
                        onClick={handleClose}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div className="Full-card__notes" style={{ maxWidth: "unset", float: "none", marginTop: "0.5rem" }}>
                      <small>{"0 Notes"}</small>
                      <FlatButton
                        className="Full-card__notes-add"
                        label={t.cards.addNote}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Paper>
        </React.Fragment>
      </Dialog>
    </div>
  )
}

export default FunderCell
