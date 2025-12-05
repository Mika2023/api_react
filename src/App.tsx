import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/home/HomePage'
import FruitsPage from './pages/fruits/FruitsPage'
import WizardsPage from './pages/wizards/wizard'
import HolidaysPage from './pages/holidays/holidays'

function App() {
  return (
    <Router basename="/api_react">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/fruits" element={<FruitsPage />} />
          <Route path="/wizards" element={<WizardsPage />} />
          <Route path="/holidays" element={<HolidaysPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App