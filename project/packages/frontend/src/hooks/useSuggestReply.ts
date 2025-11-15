import { useMutation } from 'react-query'
import { postSuggestReply } from '../services/api'

export function useSuggestReply() {
  return useMutation((id: string) => postSuggestReply(id))
}