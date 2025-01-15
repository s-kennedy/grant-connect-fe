import React, { useMemo, useState } from 'react'
import { Chart } from 'react-chartjs-2';


const BarChart = ({records, ...props}) => {
  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <Chart type='bar' data={data} />
  )
}

export default BarChart
