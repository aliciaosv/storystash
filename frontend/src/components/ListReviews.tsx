import { useState, useEffect } from 'react'
import axios from 'axios'

interface Review {
  reviewID: number
  userID: number
  rating: number
  comment: string
  bookID: number
}

interface BookReview extends Review {
  bookTitle: string
}

interface ListProps {
  userID?: number
  bookID?: number
}

const ReviewsList: React.FC<ListProps> = ({ userID, bookID }) => {
  const [reviews, setReviews] = useState<BookReview[]>([])

  useEffect(() => {
    const getReviews = async () => {
      try {
        let response
        if (userID) {
          response = await axios.get(`http://localhost:3004/storystash/reviews/user/${userID}`)
        } else if (bookID) {
          response = await axios.get(`http://localhost:3004/storystash/reviews/book/${bookID}`)
        } else {
          return
        }
        const joinTitles = await Promise.all(
          response.data.map(async (review: Review) => {
            const bookResponse = await axios.get(`http://localhost:3004/storystash/books/${review.bookID}`)
            return {... review, bookTitle: bookResponse.data.title}
          })
        )
        setReviews(joinTitles)
      } catch (error) {
        console.error('Kunde inte hämta några recensioner', error)
      }
    }

    getReviews()
  }, [userID, bookID])

  const deleteReview = async (reviewID: number) => {
    try {
      if (userID) {
        await axios.delete(`http://localhost:3004/storystash/reviews/${reviewID}/${userID}`)
        setReviews(reviews.filter(review => review.reviewID !== reviewID))
        alert('Recension borttagen!')
      } else {
        console.log('UserID saknas här')
      }
    } catch (error) {
      console.log('Det gick inte att ta bort recensionen', error)
    }
  }

  return (
    <div>
      <h4 className='header'>Dina recensioner:</h4>
      {reviews.length === 0 ? (
        <p>Du har inte recenserat några böcker än.</p>
      ) : (
        <ul>
          <div className='saved-books'>
            {reviews.map((review) => (
                <li key={review.reviewID}>
                  <p>Bok: {review.bookTitle}</p>
                  <p>Betyg: {review.rating}</p>
                  <p>Kommentar: {review.comment}</p>
                  <button onClick={() => deleteReview(review.reviewID)}>Ta bort recension</button>
                </li>
            ))}
          </div>
        </ul>
      )}
    </div>
  )
}

export default ReviewsList
