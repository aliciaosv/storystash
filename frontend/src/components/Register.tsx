import { useState } from 'react'
import axios from 'axios'

function Register() {
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
      setMessage('Du är registrerad! Du kan nu logga in.')
    } catch (error) {
      setMessage('Det gick fel när du registrerade. Försök igen')
    }
  }

  return (
    <div className='center'>
      <div className='login'>
        {/* <h4 className='welcome-text'>Registrera dig</h4> */}
        <input
          type='text'
          placeholder='Användarnamn'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='inputfield'
        />
        <input
          type='email'
          placeholder='Mailadress'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='inputfield'
        />
        <input
          type='password'
          placeholder='Lösenord'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='inputfield'
        />
        <button onClick={registerUser}>Registrera dig</button>
        {message && <p>{message}</p>}
      </div>


    </div>
  )
}

export default Register
