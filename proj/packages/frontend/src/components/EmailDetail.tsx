import React from "react";
import { Box, Heading, Text, Button, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEmail } from "../hooks/useEmail";
import { useSuggestReply } from "../hooks/useSuggestReply";
import SuggestReplyModal from "./SuggestReplyModal";

const EmailDetail: React.FC = () => {
  const { id } = useParams();
  const { data: email, isLoading } = useEmail(id!);
  const suggest = useSuggestReply();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [reply, setReply] = React.useState("");

  if (isLoading) return <Spinner />;

  const handleSuggest = async () => {
    const r = await suggest.mutateAsync(id!);
    setReply(r);
    setModalOpen(true);
  };

  return (
    <Box p="6">
      <Heading size="lg" mb="3">{email.subject}</Heading>
      <Text mb="1">From: {email.from}</Text>
      <Text fontSize="sm" mb="4">{new Date(email.date).toLocaleString()}</Text>
      <Text whiteSpace="pre-wrap" mb="4">{email.body}</Text>

      <Button colorScheme="blue" onClick={handleSuggest} isLoading={suggest.isLoading}>
        Suggest Reply
      </Button>

      <SuggestReplyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        reply={reply}
      />
    </Box>
  );
};

export default EmailDetail;
