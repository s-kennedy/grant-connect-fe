import React, { useMemo, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


const PieChart = ({records, ...props}) => {
  const giftsByRecipient = records.reduce((obj, gift) => {
    if (!gift.charity) {
      return obj
    }

    if (!!obj[gift.charity.id]) {
      obj[gift.charity.id].gifts_total = obj[gift.charity.id].gifts_total + gift.gift_amount
    } else {
      obj[gift.charity.id] = {
        charity_name: gift.charity.name,
        gifts_total: gift.gift_amount
      }
    }
    return obj
  }, {})

  const charityIds = Object.keys(giftsByRecipient)
  const labels = charityIds.map(id => giftsByRecipient[id].charity_name.length > 23 ? `${giftsByRecipient[id].charity_name.substring(0,25)}…` : giftsByRecipient[id].charity_name)
  const series = charityIds.map((id) => giftsByRecipient[id].gifts_total)


  const data = {
    labels: labels,
    datasets: [{
      label: 'Total $ amount received',
      data: series,
      borderWidth: 1,
      backgroundColor: ["#d0021b","#417505","#ffc72c","#4c9eff"]
    }]
  }

  const options = {
    aspectRatio: 1,
    plugins: {
            legend: {
                display: false
            },
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
