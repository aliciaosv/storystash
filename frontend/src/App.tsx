import './App.css'
import './components/BookSearch'
import AppRoutes from './routes'
import NavBar from './components/NavBar'
import { UserProvider } from './components/UserContext'
import { BrowserRouter as Router } from 'react-router-dom'

function App() {
  return (
    <UserProvider>
      <Router>
        <NavBar />
        <div className='contents'>
          <AppRoutes />
        </div>
      </Router>
    </UserProvider>
  )
}

export default App
