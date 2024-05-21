import { useState } from 'react'
import axios from 'axios'

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const loginUser = async () => {
    try {
      const response = await axios.post('http://localhost:3004/storystash/login', { email, password })
      const userData = response.data
      localStorage.setItem('user', JSON.stringify(userData))
      setMessage('Inloggad!')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || 'Inlogging misslyckades')
      }
      setMessage('Inloggning misslyckades')
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
