import cors from 'cors'
import express from 'express'
import * as sqlite from 'sqlite'
import { Database } from 'sqlite'
import sqlite3 from 'sqlite3'
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

//--------------------------------------------------------------------------
//Spara en bok till Books-tabellen:
app.post('/storystash/books', async (req, res) => {
  const { title, author, publishedDate, bookDescription, thumbnailURL, googleBooksID } = req.body

  try {
    const result = await database.run(
      'INSERT INTO Books (title, author, publishedDate, bookDescription, thumbnailURL, googleBooksID) VALUES (?, ?, ?, ?, ?, ?)', [title, author, publishedDate, bookDescription, thumbnailURL, googleBooksID]
    )
    res.status(201).json({ message: 'Boken är sparad till Books', bookID: result.lastID })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

//Hämta alla böcker från Books-tabellen
app.get('/storystash/books', async (_req, res) => {
  try {
    const books = await database.all('SELECT * FROM Books')
    res.json(books)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Kolla om en bok finns
app.get('/storystash/books/check/:title', async (req, res) => {
  const title = req.params.title
  try {
    const book = await database.get('SELECT * FROM Books WHERE title = ?', [title])
    if (book) {
      res.json({ exists: true, bookID: book.bookID })
    } else {
      res.json({ exists: false })
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

//Hämta en specifik bok från Books-tabellen, baserat på bookID
app.get('/storystash/books/:bookID', async (req, res) => {
  const bookID = req.params.bookID

  try {
    const book = await database.get('SELECT * FROM Books WHERE bookID = ?', [bookID])
    if (!book) {
      return res.status(404).json({ message: 'Boken hittade vi inte' })
    }
    res.json(book)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})


//Spara/Hämta/Ta bort böcker från bokhyllan
app.post('/storystash/user-bookshelf', async (req, res) => {
  const { userID, bookID } = req.body

  try {
    const result = await database.run('INSERT INTO UserBooks (userID, bookID) VALUES (?, ?)', [userID, bookID])
    res.status(201).json({ message: 'Boken är sparad till bokhyllan!', userBookID: result.lastID })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

//Hämta en användares bokhylla baserat på userID
app.get('/storystash/user-bookshelf/:userID', async (req, res) => {
  const userID = req.params.userID
  try {
    const userBooks = await database.all(`SELECT UserBooks.userBookID, Books.bookID, Books.title, Books.author, Books.publishedDate, Books.bookDescription, Books.thumbnailURL, Books.googleBooksID
    FROM UserBooks
    JOIN Books ON UserBooks.bookID = Books.bookID
    WHERE UserBooks.userID = ?`, [userID])
    res.json(userBooks)
  } catch (error) {
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



app.listen(3004, () => {
  console.log('Porteliporten är öpppen')
})
