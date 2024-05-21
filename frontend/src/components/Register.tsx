import { useState } from 'react'
import axios from 'axios'

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const registerUser = async () => {
    try {
      const response = await axios.post('http://localhost:3004/storystash/register', { username, email, password })
      const userData = response.data
      localStorage.setItem('user', JSON.stringify(userData))
      console.log(userData)
      setMessage('Du är registrerad!')
    } catch (error) {
      setMessage('Det gick fel när du registrerade. Försök igen')
    }
  }

  return (
    <div>
      <h2>Registrera dig</h2>
      <input
        type='text'
        placeholder='Användarnamn'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type='email'
        placeholder='Mailadress'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='Lösenord'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={registerUser}>Registrera dig</button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Register
