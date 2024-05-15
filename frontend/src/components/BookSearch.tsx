import { useState } from 'react'
import axios from 'axios'
// import { useHistory } from 'react-router-dom'

interface Book {
  id: string
  volumeInfo: {
    title: string
    description?: string
    imageLinks?: {
      thumbnail: string
    }
  }
}

const BookSearch: React.FC = () => {
  const [search, setSearch] = useState<string>('')
  const [books, setBooks] = useState<Book[]>([])
  // const history = useHistory()

  const api = (query:string): string => {
    const key = 'AIzaSyDV7p5ENjVvrTddyECfRTJIdVPSJv8KzA0'
    return `https://www.googleapis.com/books/v1/volumes?q=${query}&printType=books&key=${key}`
  }

  const searchBook = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      try {
        const response = await axios.get(api(search))
        setBooks(response.data.items)
      } catch (error) {
        console.error('Nu gick det fel: ', error)
      }
    }
  }

  const bookCover = (book: Book): string => {
    return book.volumeInfo.imageLinks?.thumbnail ?? 'src/assets/placeholder.png'
  }

  // const resultModal = (bookId: string) => {
  //   // history.push(`/result-modal/${bookId}`)
  // }

  return (
    <div>
      <div>
        <h1>Sök efter en bok!</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={searchBook}
          placeholder="T.ex Karin Boye, Pippi..."
        />
      </div>

      {books.length > 0 && (
        <div>
          {books.map((book) => (
            <div key={book.id}>
              <img src={bookCover(book)} alt={book.volumeInfo.title} />
              <div>
                <h4>{book.volumeInfo.title}</h4>
                <p>{book.volumeInfo.description}</p>
                {/* <button onClick={() => resultModal(book.id)}>Läs mer om boken</button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

}

export default BookSearch
