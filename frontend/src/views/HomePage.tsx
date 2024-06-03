import Login from '../components/Login'
import Register from '../components/Register'
import { useUser } from '../components/UserContext'
// import library from '../assets/library.jpg'

function HomePage() {
  const { user } = useUser()

  return (
    <>
      <div className='homepage'>
        <div>
          <h1 className='header-home'>Välkommen till StoryStash!</h1>
          <h4 className='welcome-text'>Upptäck böcker du vill läsa, spara dem i din bokhylla och recensera dem!</h4>
        </div>
        {!user && (
          <>
            <div>
              <Login />
            </div>
            <div>
              <h2 className='header-home'>Inte medlem än?</h2>
              <Register />
            </div>
          </>
        )}
      </div>
    </>
  )

}

export default HomePage
