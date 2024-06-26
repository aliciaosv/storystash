import { useState } from 'react'
import { useUser } from './UserContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
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
    <div className='center'>
      <div className='login'>
        <h2 className='header-home'>Logga in</h2>
        <input
          type="email"
          placeholder="Mailadress"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='inputfield'
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='inputfield'

        />
        <button onClick={loginUser}>Logga in</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  )
}

export default Login
