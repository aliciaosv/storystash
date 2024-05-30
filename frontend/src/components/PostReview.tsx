import { useState } from 'react'
import axios from 'axios'
import { Modal, Button } from 'react-bootstrap'

interface Reviews {
  userID: number
  bookID: number
  show: boolean
  handleClose: () => void
  addedReview: () => void
}

const Review: React.FC<Reviews> = ({ userID, bookID, addedReview, handleClose, show }) => {
  const [rating, setRating] = useState<number>(1)
  const [comment, setComment] = useState<string>('')

  const addReview = async () => {
    try {
      const response = await axios.get(`http://localhost:3004/storystash/user-bookshelf/${userID}/${bookID}`)
      const data = response.data

      if (!data.exists) {
        alert('Du kan bara recensera böcker som du lagt till i din bokhylla')
        return
      }

      console.log('Recension som försöker skickas:', { userID, bookID, rating, comment })

      await axios.post(`http://localhost:3004/storystash/reviews/user/${userID}`, {
        userID,
        bookID,
        rating,
        comment,
      })
      alert('Recensionen har lagts till!')
      console.log('Recensionen:', { userID, bookID, rating, comment })
      setRating(1)
      setComment('')
      addedReview()
    } catch (error) {
      console.log('Det strular i Review-komponenten', error)
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Vad tyckte du om boken?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>
          Betyg:
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </label>
        <label>
          Kommentar:
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
        </label>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Stäng
        </Button>
        <Button variant="primary" onClick={addReview}>
          Lägg till recension
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Review
