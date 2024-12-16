// Global DOM components.
import React, { Component } from 'react'
import { Dialog, FlatButton } from 'material-ui'

// App Language.
import { getLanguage } from 'data/locale'

class ProfileGiftAnalysisModal extends Component {
  render() {
    const { t } = getLanguage()

    return (
      <Dialog
        className="Profile-gift-analysis-dialog"
        title="Gift Detail"
        actions={<FlatButton label={t.global.close} onClick={this.props.closeModal} />}
        open={this.props.modalOpened}
        onRequestClose={this.props.closeModal}
      >
        <span className="Profile-gift-analysis-dialog-modal-name">{this.props.modalName}</span>
        {this.props.modalContent}
      </Dialog>
    )
  }
}

export default ProfileGiftAnalysisModal
