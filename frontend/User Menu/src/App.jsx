import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Menu from './components/Menu'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
      </Routes>
    </Router>
  )
}

export default App
