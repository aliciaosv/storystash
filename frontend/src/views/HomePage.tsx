import Login from '../components/Login'
import Register from '../components/Register'

const HomePage: React.FC = () => {

  return (
    <>
    <div>
      <h1>Välkommen till StoryStash!</h1>
      <h4>Upptäck böcker du vill läsa, spara dem i din bokhylla och recensera!</h4>
    </div>
    <div>
      <Login />
    </div>
    <div>
      <h2>Inte medlem än?</h2>
      <Register />
    </div>
    </>
  )

}

export default HomePage
