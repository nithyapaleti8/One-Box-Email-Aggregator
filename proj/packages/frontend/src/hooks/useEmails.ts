import { useQuery } from "react-query";
import { fetchGmailMessages } from "../services/api";

export function useEmails() {
  return useQuery(["emails"], () => fetchGmailMessages());
}
