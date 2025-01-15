import React, { useMemo, useState } from 'react'
import { MaterialReactTable } from 'material-react-table'
import { Dialog, FlatButton, IconButton } from 'material-ui'
import FullTextModal from './FullTextModal'
import FunderHeader from './FunderHeader'
import FunderCell from './FunderCell'
import CharityCell from './CharityCell'
import CharityHeader from './CharityHeader'
import AmountHeader from './AmountHeader'
import FocusHeader from './FocusHeader'
import LocationHeader from './LocationHeader'
import YearHeader from './YearHeader'
import PurposeHeader from './PurposeHeader'
import { Search, Check, UnfoldMore } from 'material-ui-icons'


const DataTable = ({records, handleFilterChange, filters}) => {
  const [selectedCharity, setSelectedCharity] = useState(null)
  const [selectedFunder, setSelectedFunder] = useState(false)

  const openCharityModal = (cell) => {
    setSelectedCharity(cell)
  }

  const openFunderModal = (cell) => {
    setSelectedFunder(true)
  }
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'charity.name',
        header: 'Recipient',
        size: 150,
        Header: ({ column }) => {
          return (
            <CharityHeader column={column} handleFilterChange={handleFilterChange} filters={filters} />
          )
        },
        Cell: ({ cell }) => <CharityCell cell={cell} />,
      },
      {
        accessorKey: 'funder.name', //access nested data with dot notation
        header: 'Funder',
        size: 150,
        Header: ({ column }) => {
          return (
            <FunderHeader column={column} handleFilterChange={handleFilterChange} filters={filters} />
          )
        },
        Cell: ({ cell }) => <FunderCell cell={cell} />,
      },
      {
        accessorKey: 'gift_amount',
        header: 'Amount',
        size: 150,
        Header: ({ column }) => {
          return (
            <AmountHeader column={column} handleFilterChange={handleFilterChange} filters={filters} />
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
            <FocusHeader column={column} handleFilterChange={handleFilterChange} filters={filters}/>
          )
        },
      },
      {
        accessorKey: 'location.city',
        header: 'Location',
        size: 150,
        Header: ({ column }) => {
          return (
            <LocationHeader column={column} handleFilterChange={handleFilterChange} filters={filters}/>
          )
        },
      },
      {
        accessorKey: 'year',
        header: 'Year',
        size: 150,
        Header: ({ column }) => {
          return (
            <YearHeader column={column} handleFilterChange={handleFilterChange} filters={filters}/>
          )
        },
      },
      {
        accessorKey: 'purpose',
        header: 'Description',
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
        },
        Header: ({ column }) => {
          return (
            <PurposeHeader column={column} handleFilterChange={handleFilterChange} filters={filters}/>
          )
        }
      }
    ],
    []
  )

  return <MaterialReactTable columns={columns} data={records} enableColumnOrdering enableTopToolbar={false} enableColumnFilters={false} />
}

export default DataTable
