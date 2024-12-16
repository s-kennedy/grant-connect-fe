// Global DOM Components.
import React from 'react'
import { FlatButton, TextField } from 'material-ui'

// App Language.
import { useTranslation } from 'react-i18next'

function FromToFilter(props) {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  return (
    <div className={`${props.page}-page__filters-${props.field}-wrapper`}>
      <TextField
        name={`${props.page}-page__filters-${props.field}-from`}
        className={`${props.page}-page__filters-${props.field}-from`}
        fullWidth={true}
        floatingLabelText={props.fromLabel}
        floatingLabelFixed={true}
        underlineShow={false}
        value={props.fromValue || ''}
        placeholder={i18n.language == 'fr' ? '0$' : '$0'}
        onChange={e => props.onChange(e, 'medianGiftMin')}
        onKeyPress={e => {
          if (isNaN(e.key) || e.key.trim() === '') {
            e.preventDefault()
          }
        }}
      />
      <small>
        <span>{t.funder.to}</span>
      </small>
      <TextField
        name={`${props.page}-page__filters-${props.field}-to`}
        className={`${props.page}-page__filters-${props.field}-to`}
        fullWidth={true}
        floatingLabelText={props.toLabel}
        floatingLabelFixed={true}
        underlineShow={false}
        value={props.toValue || ''}
        placeholder={`$ ${t.facets.unlimited}`}
        onChange={e => props.onChange(e, 'medianGiftMax')}
        onKeyPress={e => {
          if (isNaN(e.key) || e.key.trim() === '') {
            e.preventDefault()
          }
        }}
      />
      {props.showActions && (
        <div className={`${props.page}-page__filters-actions`}>
          <FlatButton
            className={`${props.page}-page__filters-button-submit`}
            label={t.global.submit}
            onClick={props.onSubmit}
          />
        </div>
      )}
      {props.showClear && (
        <div className={`${props.page}-page__filters-actions`}>
          <FlatButton
            className={`${props.page}-page__filters-button-clear`}
            label={t.global.clear}
            onClick={props.onCancel}
          />
        </div>
      )}
    </div>
  )
}

export default FromToFilter
