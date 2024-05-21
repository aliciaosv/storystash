import cors from 'cors'
import express from 'express'
import * as sqlite from 'sqlite'
import { Database } from 'sqlite'
import sqlite3 from 'sqlite3'
import bcrypt from 'bcrypt'
let database: Database

;(async () => {
  database = await sqlite.open({
    driver: sqlite3.Database,
    filename: 'list.sqlite'
  })
  await database.run('PRAGMA foreign_keys = ON')
  console.log('Kuckelikuuu')
})()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (_request, response) => {
  response.send('Hej hallå!')
})

//Användarroutes:
app.post('/storystash/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const result = await database.run('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
    res.status(201).json({ message: 'Användare skapad!', userID: result.lastID });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
})

app.post('/storystash/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await database.get('SELECT * FROM Users WHERE email = ?', [email]);
    if (!user) {
      return res.status(404).json({ message: 'Användaren hittades inte' });
    }
    if (password !== user.password) {
      return res.status(401).json({ message: 'Felaktigt lösenord, prova igen!' });
    }
    res.status(200).json({ userID: user.userID, username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
})

app.get('/storystash/users', async (req, res) => {
  try {
    const users = await database.all('SELECT * FROM Users')
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

app.get('/storystash/users/:userID', async (req, res) => {
  const userID = req.params.userID
  try {
    const user = await database.get('SELECT * FROM Users WHERE userID = ?', [userID])
    if (!user) {
      return res.status(404).json({ message: 'Användaren hittas inte' })
    }
    res.json(user)
  } catch(error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

app.put('/storystash/users/:userID', async (req, res) => {
  const userID = req.params.userID
  const { username, email, password } = req.body
  try {
    const result = await database.run('UPDATE Users SET username = ?, email = ?, password = ? WHERE userID = ?', [username, email, password, userID])
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Användaren hittades inte' })
    }
    res.json({ message: 'Användaren uppdaterad.' })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

app.delete('/storystash/users/:userID', async (req, res) => {
  const userID = req.params.userID
  try {
    const result = await database.run('DELETE FROM Users WHERE userID = ?', [userID])
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Användaren hittades inte' })
    }
    res.json({ message: 'Användaren borttagen' })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

//Spara/Hämta/Ta bort böcker från bokhyllan
app.post('/storystash/user-bookshelf', async (req, res) => {
  const { userID, bookID } = req.body
  try {
    const existingBook = await database.get('SELECT * FROM UserBooks WHERE userID = ? AND bookID = ?', [userID, bookID])
    if (existingBook) {
      return res.status(400).json({ message: 'Boken finns redan i bokhyllan' })
    }
    const result = await database.run('INSERT INTO UserBooks (userID, bookID) VALUES (?,?)', [userID, bookID])
    res.status(201).json({ message: 'Boken är tillagd', userBookID: result.lastID })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

app.get('/storystash/user-bookshelf/:userID', async (req, res) => {
  const userID = req.params.userID
  try {
    const userBooks = await database.all('SELECT * FROM UserBooks WHERE userID = ?', [userID])
    res.json(userBooks)
  } catch(error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

app.delete('/storystash/user-bookshelf/:userBookID', async (req, res) => {
  const userBookID = req.params.userBookID
  try {
    const result = await database.run('DELETE FROM UserBooks WHERE userBookID = ?', [userBookID])
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Hittade ingen bok' })
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

//Recensioner
app.post('/storystash/reviews', async (req, res) => {
  const { userID, bookID, rating, comment } = req.body
  try {
    const result = await database.run('INSERT INTO Reviews (userID, bookID, rating, comment) VALUES (?, ?, ?, ?)', [userID, bookID, rating, comment])
    res.status(201).json({ message: 'Recension tillagd', reviewID: result.lastID })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

//Hämta alla recensioner
app.get('/storystash/reviews', async (_req, res) => {
  try {
    const reviews = await database.all('SELECT * FROM Reviews')
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

app.get('/storystash/reviews/:bookID', async (req, res) => {
  const bookID = req.params.bookID
  try {
    const bookReviews = await database.all('SELECT * FROM Reviews WHERE bookID = ?', [bookID])
    res.json(bookReviews)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

app.put('/storystash/reviews/:reviewID', async (req, res) => {
  const reviewID = req.params.reviewID
  const { rating, comment } = req.body
  try {
    const result = await database.run('UPDATE Reviews SET rating = ?, comment = ? WHERE reviewID = ?', [rating, comment, reviewID])
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

app.delete('/storystash/reviews/:reviewID', async (req, res) => {
  const reviewID = req.params.reviewID
  try {
    const result = await database.run('DELETE FROM Reviews WHERE reviewID = ?', [reviewID])
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Det gick inte att ta bort' })
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})


app.listen(3004, () => {
  console.log('Porteliporten är öpppen')
})
