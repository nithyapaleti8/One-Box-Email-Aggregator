import React from 'react'
import { Box, Heading, Text, Button, Spinner } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useEmail } from '../hooks/useEmail'
import { useSuggestReply } from '../hooks/useSuggestReply'
import SuggestReplyModal from './SuggestReplyModal'

const EmailDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: email, isLoading } = useEmail(id!)
  const suggest = useSuggestReply()
  const [isModalOpen, setModalOpen] = React.useState(false)
  const [replyText, setReplyText] = React.useState('')

  if (isLoading) return <Spinner m="auto" />

  const handleSuggest = async () => {
    const { mutateAsync } = suggest
    const reply = await mutateAsync(id!)
    setReplyText(reply)
    setModalOpen(true)
  }

  return (
    <Box p="6" overflowY="auto">
      <Heading size="lg" mb="2">{email.subject}</Heading>
      <Text mb="4">From: {email.from?.map((f: any) => f.address).join(', ')}</Text>
      <Text whiteSpace="pre-wrap" mb="4">{email.body}</Text>
      <Button colorScheme="blue" onClick={handleSuggest} isLoading={suggest.isLoading}>
        Suggest Reply
      </Button>

      <SuggestReplyModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        reply={replyText}
      />
    </Box>
  )
}

export default EmailDetail