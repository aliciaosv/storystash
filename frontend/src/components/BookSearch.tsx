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

//Borde verkligen refaktorisera denna komponenten och montera i en vy future me
function BookSearch() {
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
      <div className='saved-books'>
        <h1 className='header'>Sök efter en bok!</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={alternateSearch}
          placeholder="T.ex Karin Boye, Pippi..."
          className='inputfield'
        />
        <button onClick={searchBook}>Sök</button>
      </div>

      {books.length > 0 && (
        <>
        <div className='search-result'>
          {books.map((book) => (
            <div key={book.id} className='result-books'>
              <img src={bookCover(book)} alt={book.volumeInfo.title} />
              <div>
                <h4 className='header'>{book.volumeInfo.title}</h4>
                <p>{book.volumeInfo.description}</p>
                <button onClick={() => chosen(book.id)} className='result-button'>Läs mer</button>
              </div>
            </div>
          ))}
        </div>
          <div className='center'>
            <button onClick={moreBooks} className='search-button'>Ladda fler böcker</button>
          </div>
        </>
      )}
    </div>
  )

}

export default BookSearch
