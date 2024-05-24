import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from './UserContext'

interface Book {
  volumeInfo: {
    title: string
    authors: string[]
    publishedDate: string
    publisher: string
    language: string
    industryIdentifiers: { identifier: string }[]
    categories: string[]
    description?: string
    imageLinks?: {thumbnail: string}
  }
}

const SearchResult: React.FC = () => {
  const [book, setBook] = useState<Book | null>(null)
  const [filteredDescription, setFilteredDescription] = useState<string | null>(null)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useUser()

  console.log('Inloggad person:', user)

  useEffect(() => {
    const bookDetails = async () => {
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`)
        const bookData = response.data
        setBook(bookData)
        if (bookData.volumeInfo.description) {
          setFilteredDescription(bookData.volumeInfo.description.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, ''))
        }
      } catch (error) {
        console.error('Knas i knausgård i bookDetails', error)
      }
    }

    bookDetails()
  }, [id])

  const goBack = () => {
    navigate('/booksearch')
  }

  const profile = () => {
    navigate('/userpage')
  }

  const bookCover = book?.volumeInfo.imageLinks?.thumbnail || 'src/assets/placeholder.png'

  const saveBook = async (book: Book) => {
    if (!user) {
      alert('Du måste vara inloggad för att spara en bok');
      return;
    }

    try {
      const checkResponse = await axios.get(`http://localhost:3004/storystash/books/check/${book.volumeInfo.title}`);
      let bookID;

      if (checkResponse.data.exists) {
        bookID = checkResponse.data.bookID;
        console.log('checkresponse-svaret:', bookID)
      } else {
        const addResponse = await axios.post('http://localhost:3004/storystash/books', {
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors?.[0] || 'Okänd författare',
          publishedDate: book.volumeInfo.publishedDate || '',
          bookDescription: book.volumeInfo.description || '',
          thumbnailURL: book.volumeInfo.imageLinks?.thumbnail || '',
          googleBooksID: id
        });

        bookID = addResponse.data.bookID;
        console.log('addresponse:',addResponse);
      }
        // Om boken inte fanns i Books-tabellen, lägg till den i user-bookshelf
        const toUserBook = await axios.post('http://localhost:3004/storystash/user-bookshelf', {
          userID: user.userID,
          bookID: bookID,
        })
        console.log('Userid:', user.userID, 'Bokens id:', bookID)

        if (toUserBook.status === 201) {
          alert('Boken är tillagd i din bokhylla!');
          console.log('Sparad bok till userBooks:', toUserBook.data);
        }

    } catch (error) {
      console.error('Kunde inte spara boken, försök igen', error);
    }
  };



  return (
    <div>
      {book && (
        <div>
          <div>
            <div>
            <h2>{book.volumeInfo.title}</h2>
              <h3>{book.volumeInfo.authors?.join(', ') || 'Okänd författare'}</h3>
              <p>Utgivningsår: {book.volumeInfo.publishedDate || 'Ej tillgängligt'}</p>
              <p>Förlag: {book.volumeInfo.publisher || 'Ej tillgängligt'}</p>
              <p>Språk: {book.volumeInfo.language || 'Ej tillgängligt'}</p>
              <p>ISBN: {book.volumeInfo.industryIdentifiers?.[0]?.identifier || 'Okänt'}</p>
              <p>Genre: {book.volumeInfo.categories?.join(', ') || 'Ej tillgängligt'}</p>
              <p>Om: {filteredDescription}</p>
            </div>
            <div>
              <img src={bookCover} alt={book.volumeInfo.title} />
            </div>
          </div>
          <button onClick={() => saveBook(book)}>Spara till din bokhylla</button>
          <button onClick={goBack}>Sök efter fler böcker</button>
          <button onClick={profile}>Gå till min bokhylla</button>
        </div>
      )}
    </div>
  )

}

export default SearchResult
