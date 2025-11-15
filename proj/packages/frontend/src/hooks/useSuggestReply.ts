import { useMutation } from "react-query";
import { suggestEmailReply } from "../services/api";

export function useSuggestReply() {
  return useMutation(suggestEmailReply);
}
