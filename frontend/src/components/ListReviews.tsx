import { useState, useEffect } from 'react'
import axios from 'axios'

interface Review {
  reviewID: number
  userID: number
  rating: number
  comment: string
}

interface ListProps {
  bookID: number
}

const ReviewsList: React.FC<ListProps> = ({ bookID }) => {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3004/storystash/reviews/${bookID}`)
        setReviews(response.data)
        console.log('Recensioner för bok:', response.data)
      } catch (error) {
        console.error('Kunde inte hämta några recensioner', error)
      }
    }

    getReviews()
  }, [bookID])

  return (
    <div>
      <h4>Recensioner:</h4>
      {reviews.length === 0 ? (
        <p>Ingen har recenserat den här boken ännu.</p>
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
