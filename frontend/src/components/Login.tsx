import { useState } from 'react'
import { useUser } from './UserContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [message] = useState<string>('')
  const { login } = useUser()
  const navigate = useNavigate()

  const loginUser = async () => {
    try {
      const response = await axios.post('http://localhost:3004/storystash/login', { email, password })
      console.log('Loginstatus:', response.data)
      if (response.status === 200) {
        login(response.data)
        navigate('/userpage')

      }
    } catch (error) {
      console.error('Login misslyckades', error)
      alert('Något gick fel när du loggade in, försök igen')
    }
  }

  return (
    <div>
      <h2>Logga in</h2>
      <input
        type="email"
        placeholder="Mailadress"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={loginUser}>Logga in</button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Login
