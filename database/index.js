const mongoClient = require('mongodb').MongoClient
const keys = require('../keys')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: keys.AUTH,
}

const connectToDb = async (app) => {
  try {
    const client = await mongoClient.connect(keys.URI, options)
    const db = client.db(keys.DB)

    app.locals.db = db
    console.log('Connected to DB!')
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectToDb
