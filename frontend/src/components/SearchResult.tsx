import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from './UserContext'
// import Review from './PostReview'

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
//Utkommenterade sektioner är en skiss på hur rendering av recensioner på böcker från andra användare skulle kunna se ut. Fungerar inte som tänkt än, men blir mer som ett sidoprojekt senare. Även denna komponenten skulle må bra av att få bli lite uppbruten. Återigen, sidoprojekt

// interface Review {
//   reviewID: number
//   userID: number
//   bookID: number
//   rating: number
//   comment: string
//   createdAt: string
// }

function SearchResult() {
  const [book, setBook] = useState<Book | null>(null)
  // const [reviews, setReviews] = useState<Review[]>([])
  // const [bookID] = useState('')
  const [regexDesc, setRegexDesc] = useState<string | null>(null)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useUser()


  console.log('Inloggad person:', user)

  useEffect(() => {
    const bookDetails = async () => {
      try {
        //Plockar data från det externa APIt och renderar det.
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`)
        const bookData = response.data
        setBook(bookData)
        if (bookData.volumeInfo.description) {
          //Jag vill bara skryta om att jag nördade ner mig lite i RegEx. Verkar dock inte fungera på alla descriptions av någon anledning, men väldigt många ser betydligt snyggare ut än innan!
          setRegexDesc(bookData.volumeInfo.description.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, ''))
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
    //Boken som vill sparas, finns den redan i Books-tabellen?
    try {
      const checkResponse = await axios.get(`http://localhost:3004/storystash/books/check/${book.volumeInfo.title}`);
      let bookID;

      if (checkResponse.data.exists) {
        bookID = checkResponse.data.bookID;
        console.log('checkresponse-svaret:', bookID)
      } else {
        //Om det är så att boken inte finns, plockar den ut nödvändig data från det externa API:t och postar det i Books-tabellen samtidigt som det postas till i UserBooks
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
        //Här fortsätter den till UserBooks
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

    // const othersReviews = await axios.get(`http://localhost:3004/storystash/reviews/${bookID}`)
    // setReviews(othersReviews.data)
  }



  return (
    <div className='result'>
      {book && (
        <div>
          <div>
            <div>
            <h2 className='header'>{book.volumeInfo.title}</h2>
              <h3>{book.volumeInfo.authors?.join(', ') || 'Okänd författare'}</h3>
              <p>Utgivningsår: {book.volumeInfo.publishedDate || 'Ej tillgängligt'}</p>
              <p>Förlag: {book.volumeInfo.publisher || 'Ej tillgängligt'}</p>
              <p>Språk: {book.volumeInfo.language || 'Ej tillgängligt'}</p>
              <p>ISBN: {book.volumeInfo.industryIdentifiers?.[0]?.identifier || 'Okänt'}</p>
              <p>Genre: {book.volumeInfo.categories?.join(', ') || 'Ej tillgängligt'}</p>
              <p>Om: {regexDesc}</p>
            </div>
            <div>
              <img src={bookCover} alt={book.volumeInfo.title} />
            </div>
          </div>
          <button onClick={() => saveBook(book)} className='result-button'>Spara till din bokhylla</button>
          <button onClick={goBack} className='result-button'>Sök efter fler böcker</button>
          <button onClick={profile} className='result-button'>Gå till min bokhylla</button>
        </div>
      )}
      {/* <h4>Vad tyckte andra om boken?</h4>
      <div>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.bookID}>
              <p>Betyg: {review.rating}</p>
              <p>Kommentar: {review.comment}</p>
              <p>Skapad: {review.createdAt}</p>
            </div>
          ))
        ): (
          <p>Den har inte blivit recenserad ännu.</p>
        )}
      </div> */}
    </div>
  )

}

export default SearchResult
