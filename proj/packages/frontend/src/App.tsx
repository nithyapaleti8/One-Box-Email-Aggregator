import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Flex } from '@chakra-ui/react'

import Sidebar from './components/Sidebar'
import EmailList from './components/EmailList'
import EmailDetail from './components/EmailDetail'

const App: React.FC = () => {
  return (
    <Flex h="100vh">
      <Sidebar />

      <Flex flex="1" direction="column">
        <Routes>
          <Route path="/" element={<EmailList />} />
          <Route path="/email/:id" element={<EmailDetail />} />
        </Routes>
      </Flex>
    </Flex>
  )
}

export default App
