import React, { useMemo, useState } from 'react'
import { MaterialReactTable } from 'material-react-table'
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { Search, Check, UnfoldMore, ArrowDownward } from 'material-ui-icons'
import { useTranslation } from 'react-i18next'

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


const DataTable = ({records, handleFilterChange, filters}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)
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
        header: t.explorer.recipient,
        size: 110,
        Header: ({ column }) => {
          return (
            <CharityHeader column={column} handleFilterChange={handleFilterChange} filters={filters} />
          )
        },
        Cell: ({ cell }) => <CharityCell cell={cell} />,
      },
      {
        accessorKey: 'funder.name', //access nested data with dot notation
        header: t.explorer.funder,
        size: 110,
        Header: ({ column }) => {
          return (
            <FunderHeader column={column} handleFilterChange={handleFilterChange} filters={filters} />
          )
        },
        Cell: ({ cell }) => <FunderCell cell={cell} />,
      },
      {
        accessorKey: 'gift_amount',
        header: t.explorer.amount,
        size: 110,
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
        header: t.explorer.focus,
        size: 110,
        Header: ({ column }) => {
          return (
            <FocusHeader column={column} handleFilterChange={handleFilterChange} filters={filters}/>
          )
        },
      },
      {
        accessorKey: 'location.city',
        header: t.explorer.location,
        size: 110,
        Header: ({ column }) => {
          return (
            <LocationHeader column={column} handleFilterChange={handleFilterChange} filters={filters}/>
          )
        },
      },
      {
        accessorKey: 'year',
        header: t.explorer.year,
        size: 110,
        Header: ({ column }) => {
          return (
            <YearHeader column={column} handleFilterChange={handleFilterChange} filters={filters}/>
          )
        },
      },
      {
        accessorKey: 'purpose',
        header: t.explorer.description,
        size: 110,
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

  const customLocalizationEn = {
    ...MRT_Localization_EN,
    showAllColumns: "Unhide all columns",
    move: "Move column"
  }

  return (
    <MaterialReactTable 
      columns={columns} 
      data={records} 
      enableColumnOrdering 
      enableTopToolbar={false} 
      enableColumnFilters={false}
      muiTableProps={{
        sx: {
          borderRight: '1px solid #D9E3E9',
          borderTop: '1px solid #D9E3E9',
        },
      }}
      muiTableHeadCellProps={{
        sx: {
          borderLeft: '1px solid #D9E3E9',
          borderBottom: '1px solid #D9E3E9',
          paddingRight: '0.4rem',
        },
      }}
      muiTableBodyCellProps={{
        sx: {
          borderLeft: '1px solid #D9E3E9',
          borderBottom: '1px solid #D9E3E9',
          paddingRight: '0.4rem',
        },
      }}
      localization={customLocalizationEn}
      icons={{
        SortIcon: (props) => (<ArrowDownward {...props} />)
      }}
    />
  )
}

export default DataTable
