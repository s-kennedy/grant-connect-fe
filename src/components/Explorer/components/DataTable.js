import React, { useMemo, useState } from 'react'
import { MaterialReactTable } from 'material-react-table'
import { Dialog, FlatButton } from 'material-ui'
import FullTextModal from './FullTextModal'

const DataTable = ({records}) => {
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'funder.name', //access nested data with dot notation
        header: 'Funder',
        size: 150
      },
      {
        accessorKey: 'charity.name',
        header: 'Recipient',
        size: 150
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        size: 150
      },
      {
        accessorKey: 'focus',
        header: 'Focus',
        size: 150
      },
      {
        accessorKey: 'location.city',
        header: 'Location',
        size: 150
      },
      {
        accessorKey: 'year',
        header: 'Year',
        size: 150
      },
      {
        accessorKey: 'purpose',
        header: 'Purpose',
        size: 150,
        Cell: ({ cell }) => {
          const fullText = cell.getValue()
          const maxLength = 50

          if (!fullText) {
            return <div>{`-`}</div>
          }
          if (fullText.length > maxLength) {
            return <FullTextModal fullText={fullText} />
          }

          return <div>{fullText}</div>
        }
      }
    ],
    []
  )

  return <MaterialReactTable columns={columns} data={records} />
}

export default DataTable
