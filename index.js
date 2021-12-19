const express = require('express')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId

const keys = require('./keys')
const connectToDb = require('./database')
const responses = require('./responses')

const app = express()

connectToDb(app)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) =>
  res.status(200).json({ message: 'Server is running successfully' })
)

app.get('/courses', async (req, res) => {
  try {
    const db = req.app.locals.db
    const courses = await db
      .collection('courses')
      .find(
        {},
        {
          projection: responses.course,
        }
      )
      .toArray()

    return res.status(200).json({
      message: courses,
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Server error',
    })
  }
})

app.post('/courses', async (req, res) => {
  try {
    const { name, code } = req.body

    if (
      !name ||
      !code ||
      typeof name !== 'string' ||
      typeof code !== 'string' ||
      name.length === 0 ||
      code.length === 0
    )
      return res.status(400).json({
        message: 'Enter valid course data',
      })

    const db = req.app.locals.db
    await db.collection('courses').insertOne({
      name,
      code,
    })
    const courses = await db
      .collection('courses')
      .find(
        {},
        {
          projection: responses.course,
        }
      )
      .toArray()

    return res.status(200).json({
      message: courses,
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Server error',
    })
  }
})

app.delete('/courses/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params
    console.log(courseId)
    if (
      !courseId ||
      typeof courseId !== 'string' ||
      courseId.length === 0 ||
      !ObjectId.isValid(courseId)
    )
      return res.status(400).json({
        message: 'Enter a valid course id',
      })

    const db = req.app.locals.db
    await db.collection('courses').deleteOne({
      _id: ObjectId(courseId)
    })
    const courses = await db
      .collection('courses')
      .find(
        {},
        {
          projection: responses.course,
        }
      )
      .toArray()

    return res.status(200).json({
      message: courses,
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Server error',
    })
  }
})

app.listen(keys.PORT, () =>
  console.log(`Server is running on port ${keys.PORT}`)
)
