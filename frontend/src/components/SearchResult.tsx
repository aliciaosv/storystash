import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

interface Book {
  volumeInfo: {
    title: string
    authors: string[]
    publishedDate: string
    publisher: string
    language: string
    industryIdentifiers: { identifier: string }[]
    categories: string[]
    description: string
    imageLinks?: {thumbnail: string}
  }
}

const SearchResult: React.FC = () => {
  const [book, setBook] = useState<Book | null>(null)
  const [filteredDescription, setFilteredDescription] = useState<string | null>(null)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    const bookDetails = async () => {
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`)
        setBook(response.data)
        setFilteredDescription(response.data.volumeInfo.description.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, ''))
      }catch (error) {
        console.error('SearchResult strular', error)
      }
    }

    bookDetails()
  }, [id])

  const goBack = () => {
    navigate('/')
  }

  const bookCover = book?.volumeInfo.imageLinks?.thumbnail || 'src/assets/placeholder.png'

  return (
    <div>
      {book && (
        <div>
          <div>
            <div>
            <h2>{book.volumeInfo.title}</h2>
              <h3>{book.volumeInfo.authors.join(', ')}</h3>
              <p>Utgivningsår: {book.volumeInfo.publishedDate}</p>
              <p>Förlag: {book.volumeInfo.publisher}</p>
              <p>Språk: {book.volumeInfo.language}</p>
              <p>ISBN: {book.volumeInfo.industryIdentifiers[0].identifier}</p>
              <p>Genre: {book.volumeInfo.categories.join(', ')}</p>
              <p>Om: {filteredDescription}</p>
            </div>
            <div>
              <img src={bookCover} alt={book.volumeInfo.title} />
            </div>
          </div>
          <button onClick={goBack}>Sök efter fler böcker</button>
        </div>
      )}
    </div>
  )

}

export default SearchResult
