import { useState } from 'react'
import Login from '../components/Login'
import Register from '../components/Register'

const LoginRegister: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  const toggle = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div>
      {/* <h2>{isLogin ? 'Logga in' : 'Registrera'}</h2> */}
      {isLogin ? <Login /> : <Register />}
      <button onClick={toggle}>
        {isLogin ? 'Har du inget konto? Registrera dig!' : 'Har du redan ett konto? Logga in här!' }
      </button>
    </div>
  )
}

export default LoginRegister
