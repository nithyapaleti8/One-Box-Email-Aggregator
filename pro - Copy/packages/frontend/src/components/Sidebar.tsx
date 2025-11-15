import React from 'react'
import { Box, VStack, Heading, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const accounts = ['account1@example.com', 'account2@example.com']
const folders = ['INBOX', 'Sent', 'Archive']

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  return (
    <Box w="250px" bg="gray.50" p="4" overflowY="auto">
      <Heading size="md" mb="4">Accounts</Heading>
      <VStack align="start" spacing="2" mb="6">
        {accounts.map(a => (
          <Button
            key={a}
            variant="ghost"
            onClick={() => navigate('/', { state: { account: a } })}
          >
            {a}
          </Button>
        ))}
      </VStack>
      <Heading size="md" mb="4">Folders</Heading>
      <VStack align="start" spacing="2">
        {folders.map(f => (
          <Button
            key={f}
            variant="ghost"
            onClick={() => navigate('/', { state: { folder: f } })}
          >
            {f}
          </Button>
        ))}
      </VStack>
    </Box>
  )
}

export default Sidebar