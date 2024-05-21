import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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
  const [startIndex] = useState<number>(0)
  const [maxResults] = useState<number>(10)
  const navigate = useNavigate()


  const api = (query:string, startIndex: number, maxResults: number): string => {
    const key = 'AIzaSyDV7p5ENjVvrTddyECfRTJIdVPSJv8KzA0'
    const startParam = `startIndex=${startIndex}`
    const maxParam = `maxResults=${maxResults}`
    return `https://www.googleapis.com/books/v1/volumes?q=${query}&printType=books&${startParam}&${maxParam}&key=${key}`
  }

  // const searchBook = async (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === 'Enter') {
  //     try {
  //       const response = await axios.get(api(search, startIndex, maxResults))
  //       setBooks(response.data.items)
  //       console.log(response.data.items)
  //     } catch (error) {
  //       console.error('Nu gick det fel: ', error)
  //     }
  //   }
  // }

  const searchBook = async () => {
    try {
      const response = await axios.get(api(search, startIndex, maxResults))
      setBooks(response.data.items)
      console.log(response.data.items)
    } catch (error) {
      console.error('Nu gick det fel: ', error)
    }
  }

  const alternateSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      searchBook();
    }
  }

  const moreBooks = async () => {
    const value = startIndex + maxResults
    try {
      const response = await axios.get(api(search, value, maxResults))
      setBooks([...books, ...(response.data.items || [])])
    } catch (error) {
      console.error('Fel i moreBooks', error)
    }
  }

  const bookCover = (book: Book): string => {
    return book.volumeInfo.imageLinks?.thumbnail ?? 'src/assets/placeholder.png'
  }

  const chosen = (bookId: string) => {
    navigate(`/${bookId}`)
  }



  return (
    <div>
      <div>
        <h1>Sök efter en bok!</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={alternateSearch}
          placeholder="T.ex Karin Boye, Pippi..."
        />
        <button onClick={searchBook}>Sök</button>
      </div>

      {books.length > 0 && (
        <div>
          {books.map((book) => (
            <div key={book.id}>
              <img src={bookCover(book)} alt={book.volumeInfo.title} />
              <div>
                <h4>{book.volumeInfo.title}</h4>
                <p>{book.volumeInfo.description}</p>
                <button onClick={() => chosen(book.id)}>Läs mer</button>
              </div>
            </div>
          ))}
          <button onClick={moreBooks}>Ladda fler böcker</button>
        </div>
      )}
    </div>
  )

}

export default BookSearch
