import { useQuery } from "react-query";
import { fetchGmailMessageById } from "../services/api";

export function useEmail(id: string) {
  return useQuery(["gmailEmail", id], () => fetchGmailMessageById(id), {
    enabled: !!id
  });
}
