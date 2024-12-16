export const SORT_BY_OPTIONS = ({ t }) => [
  { value: 'match', label: t.search.filter.match },
  { value: 'name', label: t.search.filter.name },
  { value: '-median_gift_size', label: t.cards.typicalGift },
  { value: 'deadline_order,upcoming_deadline,-expired_deadline', label: t.search.filter.priority },
  { value: '-capacity_score', label: t.search.filter.capacity }
]
