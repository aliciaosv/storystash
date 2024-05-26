import { Link } from 'react-router-dom'
import ReviewsList from '../components/ListReviews'
import { useUser } from '../components/UserContext'
import  Review  from '../components/PostReview'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface Book {
  userBookID: number
  bookID: number
  title: string
  author: string
  thumbnailURL: string
}

const UserPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<number | null>(null)
  const { user } = useUser()

  console.log('Inloggad person:', user)

  useEffect(() => {
    const savedBooks = async () => {
      try {
        const userID = user?.userID
        if (!userID) {
          console.error('Användare saknas!')
          return
        }
        const response = await axios.get(`http://localhost:3004/storystash/user-bookshelf/${userID}`)
        setBooks(response.data)
        console.log('Böcker i hyllan', response.data)
      } catch (error) {
        console.error('Användarens böcker gick inte att hitta', error)
      }
    }

    savedBooks()
  }, [user])

  const removeBook = async (userBookID: number) => {
    //uppdatering av state
    setBooks(books.filter(book => book.userBookID !== userBookID))

    try {
      await axios.delete(`http://localhost:3004/storystash/user-bookshelf/${userBookID}`)
      alert('Boken har tagits bort från bokhyllan')
    } catch (error) {
      console.error('Det gick inte att ta bort den. :(', error)
      // Återställ state om det misslyckas
      const userID = user?.userID
      if (userID) {
        const response = await axios.get(`http://localhost:3004/storystash/user-bookshelf/${userID}`)
        setBooks(response.data)
      }
    }
  }

  if (!user) {
    return <div>Du är inte inloggad. Logga in för att spara böcker och recensera dem!</div>
  }

  const bookInfo = selectedBook ? books.find(book => book.userBookID === selectedBook): null

  return (
    <>
      <div>
        <h2>Välkommen tillbaka, {user.username}!</h2>
        <h4>Dina sparade böcker:</h4>
        {books.length === 0 ? (
          <p>Du har inte sparat några böcker. <Link to="/booksearch">Lägg till några!</Link></p>
        ) : (
          books.map((book) => (
            <div key={book.userBookID}>
              <h5>{book.title}</h5>
              <p>{book.author}</p>
              <img src={book.thumbnailURL} alt={book.title} />
              <button onClick={() => setSelectedBook(book.bookID)}>Recensera boken</button>
              <button onClick={() => removeBook(book.userBookID)}>Ta bort boken</button>
            </div>
          ))
        )}
      </div>
      {selectedBook && (
        <Review
          userID={user.userID}
          bookID={selectedBook}
          // title={books.find(book => book.userBookID === selectedBook)?.title}
          addedReview={() => setSelectedBook(null)}
        />
      )}
      <div>
        <p>Vill du ha fler böcker i listan? <Link to="/booksearch">Lägg till några!</Link></p>
      </div>
      <div>
        <h4>Dina recensioner:</h4>
        {bookInfo?.bookID && (
          <ReviewsList bookID={bookInfo.bookID} />
        )}
      </div>
    </>
  )
}

export default UserPage
