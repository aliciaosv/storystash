import { Link } from 'react-router-dom'
import { useUser } from '../components/UserContext'



const UserPage: React.FC = () => {
  const { user } = useUser()
  if(!user) {
    return <div>Du är inte inloggad. Logga in för att spara böcker och recensera dem!</div>
  }

  const savedBooks: string[] = []
  const reviews: string[] = []

  return (
    <>
    <div>
      <h2>Välkommen till tillbaka, {user.username}!</h2>
      <h4>Dina sparade böcker:</h4>
      {savedBooks.length === 0 ? (
        <p>Du har inte sparat några böcker. <Link to="/booksearch">Lägg till några!</Link></p>
      ) : (
        <ul>
          {savedBooks.map((book, index) => (
            <li key={index}>{book}</li>
          ))}
        </ul>
      )}
    </div>
    <div>
      <h2>Dina recensioner:</h2>
      {reviews.length === 0 ? (
        <p>Du har ännu inte recenserat några böcker. <Link to="/booksearch">Lägg till en recension</Link></p>
      ) : (
        <ul>
          {reviews.map((review, index) => (
            <li key={index}>{review}</li>
          ))}
        </ul>
      )}
    </div>

    </>
  )
}

export default UserPage
