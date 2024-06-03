import './App.css'
import './components/BookSearch'
import AppRoutes from './routes'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import { UserProvider } from './components/UserContext'
import { BrowserRouter as Router } from 'react-router-dom'

function App() {
  return (
    <UserProvider>
      <Router>
        <div className='root'>
          <NavBar />
          <div className='contents'>
            <AppRoutes />
          </div>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  )
}

export default App
