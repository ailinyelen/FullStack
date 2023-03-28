const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('common'))


// Connection with DB

const url = 'mongodb+srv://ailinyelenb:mongoDBtest@test.vu51asg.mongodb.net/contactsApp?retryWrites=true&w=majority'

mongoose.set('strictQuery', false)
mongoose.connect(url)

// Contact Schema

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 5,
        required: true
    },
    id: String
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


const Contact = mongoose.model('Contact', contactSchema)


// Get all contacts

app.get('/api/persons', (request, response) => {
    console.log('Get Contacts')
    Contact.find({}).then(result => response.json(result))
})

// Get contact by ID

app.get('/api/persons/:id', (request, response) => {
    Contact
        .findById(request.params.id)
        .then(contact => {
            console.log(contact)
            contact
                ? response.json(contact)
                : response.status(404).json({ error: 'Contact Not Found' })
        })
        .catch(error => {
            if (error.name === 'CastError')
                return response.status(400).json({ error: 'Malformatted id' })
        })
})

// Add new contact

app.post('/api/persons', (request, response) => {
    const contact = new Contact(request.body)

    contact
        .save()
        .then(result => {
            console.log(`added ${contact.name} number ${contact.number} to phonebook`)
            response.json(contact)
        })
        .catch(error => {
            if (error.name === 'ValidationError')
                return response.status(400).json({ error: error.message })
        })
})

// Modify contact

app.put('/api/persons/:id', (request, response) => {
    const contact = request.body

    Contact
        .updateOne({ name: contact.name }, { $set: { number: contact.number } }, {runValidators: true})
        .then(result => {
            console.log(result)
            console.log(`updated number ${contact.number} for: ${contact.name} to phonebook`)
            response.end()
        })
        .catch(error => {
            if (error.name === 'ValidationError')
                return response.status(400).json({ error: error.message })
        })

})

// Delete contact

app.delete('/api/persons/:id', (request, response) => {
    console.log('delete: ', request.params.id)

    Contact
        .findByIdAndDelete(request.params.id)
        .then(result => {
            console.log('result: ', result)
            response.status(204).end()
        })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
