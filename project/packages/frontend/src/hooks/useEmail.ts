// packages/frontend/src/hooks/useEmail.ts

import { useQuery } from 'react-query'
import { fetchEmailById } from '../services/api'

export function useEmail(id: string) {
  return useQuery(['email', id], () => fetchEmailById(id), {
    enabled: Boolean(id)
  })
}