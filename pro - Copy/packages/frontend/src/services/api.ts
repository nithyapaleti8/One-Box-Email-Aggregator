import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 5000
})

export async function fetchEmails(params: {
  accountId?: string
  folder?: string
  label?: string
  q?: string
}) {
  const resp = await API.get('/emails', { params })
  return resp.data
}

export async function fetchEmailById(id: string) {
  const resp = await API.get(`/emails/${id}`)
  return resp.data
}

export async function postSuggestReply(id: string) {
  const resp = await API.post(`/suggest-reply/${id}`)
  return resp.data.reply as string
}