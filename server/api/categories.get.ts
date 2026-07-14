import { getCategories } from '../utils/quotes'

export default defineEventHandler(async () => {
  return { categories: await getCategories() }
})
