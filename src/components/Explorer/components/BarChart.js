import { useTranslation } from 'react-i18next'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({records, ...props}) => {
  const { i18n } = useTranslation()
  const t = i18n.getResourceBundle(i18n.language)

  const giftsByFunder = records.reduce((obj, gift) => {
    if (!gift.funder) {
      return obj
    }

    if (!!obj[gift.funder.id]) {
      obj[gift.funder.id].gifts_total = obj[gift.funder.id].gifts_total + gift.gift_amount
    } else {
      obj[gift.funder.id] = {
        funder_name: gift.funder.name,
        gifts_total: gift.gift_amount
      }
    }
    return obj
  }, {})

  const funderIds = Object.keys(giftsByFunder)
  const labels = funderIds.map(id => giftsByFunder[id].funder_name.length > 23 ? `${giftsByFunder[id].funder_name.substring(0,25)}…` : giftsByFunder[id].funder_name)
  const series = funderIds.map((id) => giftsByFunder[id].gifts_total)

  const data = {
    labels: labels,
    datasets: [{
      label: t.explorer.total_amount_given,
      data: series,
      borderWidth: 1,
      backgroundColor: '#ffc72c',
    }]
  }

  const options = {
    aspectRatio: 1,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true
      }
    }
  }

  return (
    <Bar options={options} data={data} />
  )
}

export default BarChart
