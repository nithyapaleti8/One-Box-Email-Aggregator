import React from "react";
import { Box, List, ListItem, Spinner, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEmails } from "../hooks/useEmails";

const EmailList: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useEmails();

  if (isLoading) return <Spinner m="auto" />;

  if (!data || data.length === 0)
    return <Text p="4">No emails found in Gmail.</Text>;

  return (
    <Box p="4" overflowY="auto">
      <List spacing="3">
        {data.map((email: any) => (
          <ListItem
            key={email.id}
            cursor="pointer"
            onClick={() => navigate(`/email/${email.id}`)}
            p="2"
            _hover={{ bg: "gray.100" }}
          >
            <Text fontWeight="bold">{email.subject || "(No subject)"}</Text>
            <Text fontSize="sm">{email.from}</Text>
            <Text fontSize="sm">{new Date(email.date).toLocaleString()}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default EmailList;
