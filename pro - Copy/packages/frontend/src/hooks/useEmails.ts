import { useQuery } from 'react-query'
import { fetchEmails } from '../services/api'

export function useEmails(opts: { accountId?: string; folder?: string; q?: string }) {
  return useQuery(['emails', opts], () => fetchEmails(opts))
}