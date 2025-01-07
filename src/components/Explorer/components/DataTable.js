import React, { useMemo, useState } from 'react'
import { MaterialReactTable } from 'material-react-table'
import { Dialog, FlatButton } from 'material-ui'
import FullTextModal from './FullTextModal'
import FunderHeader from './FunderHeader'
import CharityHeader from './CharityHeader'
import AmountHeader from './AmountHeader'
import FocusHeader from './FocusHeader'


const DataTable = ({records}) => {
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'charity.name',
        header: 'Recipient',
        size: 150,
        Header: ({ column }) => {
          return (
            <CharityHeader column={column} />
          )
        }
      },
      {
        accessorKey: 'funder.name', //access nested data with dot notation
        header: 'Funder',
        size: 150,
        Header: ({ column }) => {
          return (
            <FunderHeader column={column} />
          )
        }
      },
      {
        accessorKey: 'gift_amount',
        header: 'Amount',
        size: 150,
        Header: ({ column }) => {
          return (
            <AmountHeader column={column} />
          )
        },
        Cell: ({ cell }) => {
          const numberValue = cell.getValue()
          const formattedValue = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(
            numberValue,
          )

          return <div>{formattedValue}</div>
        }
      },
      {
        accessorKey: 'focus',
        header: 'Focus',
        size: 150,
        Header: ({ column }) => {
          return (
            <FocusHeader column={column} />
          )
        },
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

  return <MaterialReactTable columns={columns} data={records} enableColumnOrdering />
}

export default DataTable
