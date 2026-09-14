import { asArray, getJson, postJson } from './client'

export const getCarousels = () => getJson('/api/common/carousels/').then(asArray)

export const submitQuery = (payload) =>
  postJson('/api/common/queries/', {
    user_id: 0,
    status: 'pending',
    ...payload,
  })
