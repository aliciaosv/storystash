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

  console.log('Redo att göra databasanrop')
})()

const app = express()

app.use(cors())

app.get('/', (_request, response) => {
  response.send('Hello World!')
})

app.listen(3000, () => {
  console.log('Webbtjänsten kan nu ta emot anrop.')
})
