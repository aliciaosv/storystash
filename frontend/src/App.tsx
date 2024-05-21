import './App.css'
import './components/BookSearch'
import AppRoutes from './routes'
// import NavBar from './components/NavBar'
import { UserProvider } from './components/UserContext'

function App() {
  return (
    <UserProvider>
      {/* <div>
        <NavBar />
      </div> */}
      <div>
        <AppRoutes />
      </div>
    </UserProvider>
  )
}

export default App
