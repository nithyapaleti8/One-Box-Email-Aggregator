import React, { useState } from 'react'
import { Box, Input, List, ListItem, Spinner, Text } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEmails } from '../hooks/useEmails'

const EmailList: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useLocation() as any
  const [query, setQuery] = useState('')
  const { data, isLoading } = useEmails({
    accountId: state?.account,
    folder: state?.folder,
    q: query
  })

  if (isLoading) return <Spinner m="auto" />

  return (
    <Box p="4" overflowY="auto">
      <Input
        placeholder="Search emails..."
        mb="4"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {data.length === 0 && <Text>No emails found.</Text>}
      <List spacing="3">
        {data.map((email: any) => (
          <ListItem
            key={`${email.accountId}-${email.uid}`}
            cursor="pointer"
            onClick={() => navigate(`/email/${email.accountId}-${email.uid}`)}
            p="2"
            _hover={{ bg: 'gray.100' }}
          >
            <Text fontWeight="bold">{email.subject}</Text>
            <Text fontSize="sm">{new Date(email.date).toLocaleString()}</Text>
            <Text fontSize="sm">Label: {email.aiLabel}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default EmailList