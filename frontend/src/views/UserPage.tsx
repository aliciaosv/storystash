import { Link } from 'react-router-dom'
import ReviewsList from '../components/ListReviews'
import  Review  from '../components/PostReview'
import { useUser } from '../components/UserContext'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'

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
  const [refreshReviews, setRefreshReviews] = useState(false)
  const [theModal, setTheModal] = useState<boolean>(false)
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

  const bookInfo = selectedBook ? books.find(book => book.userBookID === selectedBook) : null
  console.log('logg från bookInfo:',bookInfo)

  const handleReviews = () => {
    setSelectedBook(null);
    setRefreshReviews(prev => !prev)
    setTheModal(false)
  }

  return (
    <>
      <div>
        <div className='container-box'>
          <h2 className='header'>Välkommen tillbaka, {user.username}!</h2>
          <h4 className='welcome'>Dina sparade böcker:</h4>
        </div>
        {books.length === 0 ? (
          <p>Du har inte sparat några böcker. <Link to="/booksearch">Lägg till några!</Link></p>
        ) : (
          books.map((book) => (
            <div key={book.userBookID} className='saved-books'>
              <div className='book-container'>
                <h5 className='header'>{book.title}</h5>
                <p>{book.author}</p>
                <img src={book.thumbnailURL} alt={book.title} className='book-thumbnail'/>
              </div>
              <div className='review-button'>
                <Button onClick={() => {
                  setSelectedBook(book.bookID)
                  setTheModal(true)
                }}
                className='custom-button'
                >Recensera boken</Button>
              </div>
              <div className='add-more'>
                <button onClick={() => removeBook(book.userBookID)}>Ta bort boken</button>
              </div>
            </div>
          ))
        )}
      </div>
      {selectedBook && (
        <Review
        userID={Number(user.userID)}
        bookID={selectedBook}
        show={theModal}
        handleClose={() => setTheModal(false)}
        addedReview={handleReviews}
        />
      )}
      <div>
        <p>Vill du ha fler böcker i listan? <Link to="/booksearch">Lägg till några!</Link></p>
      </div>
      {/* <div className='saved-books'> */}
        <div className='book-container'>
          <h4>Dina recensioner:</h4>
          <ReviewsList
          userID={Number(user.userID)}
          key={String(refreshReviews)}
          />
        </div>

    </>
  )
}

export default UserPage
