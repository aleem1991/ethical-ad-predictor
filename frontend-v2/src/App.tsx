import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/ui/navbar'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { HistoryPage } from './pages/HistoryPage'
import { DocsPage } from './pages/DocsPage'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f0f0f] font-sans overflow-x-hidden selection:bg-[#4da5fc]/30 selection:text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/docs" element={<DocsPage />} />
        </Routes>
      </div>
    </Router>
  )
}
