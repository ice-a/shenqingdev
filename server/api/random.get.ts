import { getRandom } from '../utils/quotes'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category ? String(query.category) : undefined
  return await getRandom(category)
})
