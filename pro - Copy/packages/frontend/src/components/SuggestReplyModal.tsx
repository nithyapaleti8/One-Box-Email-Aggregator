import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea
} from '@chakra-ui/react'

interface Props {
  isOpen: boolean
  onClose: () => void
  reply: string
}

const SuggestReplyModal: React.FC<Props> = ({ isOpen, onClose, reply }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Suggested Reply</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea value={reply} rows={8} isReadOnly />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SuggestReplyModal