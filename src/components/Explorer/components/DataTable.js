import React, { useMemo, useState } from 'react'
import { MaterialReactTable } from 'material-react-table'
import { Dialog, FlatButton } from 'material-ui'
import FullTextModal from './FullTextModal'

//nested data is ok, see accessorKeys in ColumnDef below
const data = [
  {
    funder: {
      id: '123',
      name: 'Ontario Arts Council',
      pipeline_status: 'identified'
    },
    recipient: {
      id: '123',
      name: 'Kitchener-Waterloo Art Gallery'
    },
    amount: '$128,855',
    focus: 'Art museums and galleries',
    location: {
      city: 'Kitchener',
      province: 'ON'
    },
    year: '2020',
    purpose:
      '“Joyful Art” at the Bennett Centre Long Term Care Home will provide residents of all capabilities with the opportunity to participate in art activities to improve overall quality of life for seniors in living in Long Term Care.'
  },
  {
    funder: {
      id: '123',
      name: 'Kitchener Waterloo Community Foundation',
      pipeline_status: null
    },
    recipient: {
      id: '123',
      name: 'Lost & Found Theatre Inc.'
    },
    amount: '$10,000',
    focus: 'Theatre',
    location: {
      city: 'Kitchener',
      province: 'ON'
    },
    year: '2022',
    purpose: 'Ambas Tres'
  },
  {
    funder: {
      id: '123',
      name: 'Canada Summer Jobs',
      pipeline_status: 'stewardship'
    },
    recipient: {
      id: '123',
      name: 'CAFKA - Contemporary Art Forum Kitchener & Area'
    },
    amount: '$22,543',
    focus: 'Arts councils and associations',
    location: {
      city: 'Kitchener',
      province: 'ON'
    },
    year: '2021',
    purpose: null
  },
  {
    funder: {
      id: '123',
      name: 'Good Foundation Inc.',
      pipeline_status: null
    },
    recipient: {
      id: '123',
      name: 'Centre in the Square Inc.'
    },
    amount: '$25,000',
    focus: 'Theatre',
    location: {
      city: 'Kitchener',
      province: 'ON'
    },
    year: '2023',
    purpose: null
  },
  {
    funder: {
      id: '123',
      name: 'CanadaHelps',
      pipeline_status: null
    },
    recipient: {
      id: '123',
      name: 'J.M. Drama Alumni'
    },
    amount: '$5,900',
    focus: 'Performing arts',
    location: {
      city: 'Kitchener',
      province: 'ON'
    },
    year: '2022',
    purpose: 'BUSH CAMP'
  }
]

const DataTable = () => {
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'funder.name', //access nested data with dot notation
        header: 'Funder',
        size: 150
      },
      {
        accessorKey: 'recipient.name',
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

  return <MaterialReactTable columns={columns} data={data} />
}

export default DataTable
