const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(cors())
app.use(morgan('common'))

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const contactsRouter = require('./controllers/contacts')

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })


app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/contacts', contactsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
