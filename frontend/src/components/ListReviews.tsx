import { useState, useEffect } from 'react'
import axios from 'axios'

interface Review {
  reviewID: number
  userID: number
  rating: number
  comment: string
}

interface ListProps {
  userID?: number
  bookID?: number
}

const ReviewsList: React.FC<ListProps> = ({ userID, bookID }) => {
  const [reviews, setReviews] = useState<Review[]>([])

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

        setReviews(response.data)
      } catch (error) {
        console.error('Kunde inte hämta några recensioner', error)
      }
    }

    getReviews()
  }, [userID, bookID])

  return (
    <div>
      <h4>Recensioner:</h4>
      {reviews.length === 0 ? (
        <p>Inga recensioner ännu.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.reviewID}>
              <p>Betyg: {review.rating}</p>
              <p>Kommentar: {review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ReviewsList
