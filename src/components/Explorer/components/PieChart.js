import React, { useMemo, useState } from 'react'
import { Pie } from 'react-chartjs-2';


const PieChart = ({records, ...props}) => {
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
    <Pie
      options={options}
      data={data}
      {...props}
    />
  )
}

export default PieChart
