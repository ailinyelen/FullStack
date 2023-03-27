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
const password = 'mongoDBtest'

const url = `mongodb+srv://ailinyelenb:${password}@test.vu51asg.mongodb.net/contactsApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// Contact Schema

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
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

app.get('/api/persons/:id', (request, response, next) => {
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
                    return response.status(400).send({ error: 'malformatted id' })
            })
})

// Add new contact

app.post('/api/persons', (request, response) => {
    console.log(request.body)
    const name = request.body.name
    const number = request.body.number

    if (!name || !number)
        response.status(400).send({ error: 'Missing Parameters' })

    else {
        const contact = new Contact({ name, number })
        contact.save().then(result => {
            console.log(`added ${name} number ${number} to phonebook`)
        })
        response.json(contact)
    }
})

// Modify contact

app.put('/api/persons/:id', (request, response) => {
    console.log(request.body)
    const newNumber = request.body.number
    const name = request.body.name

    if (!newNumber || !name)
        response.status(400).json({ error: 'Missing Parameters' })
    else 
        Contact
            .updateOne({name: name}, {$set: {number: newNumber}}, {})
            .then(result => {
                console.log(result)
                console.log(`updated number ${newNumber} for: ${name} to phonebook`)
                response.end()
            })
})

// Delete contact

app.delete('/api/persons/:id', (request, response) => {
    console.log('delete: ', request.params.id)
    //console.log(Contact.findById(request.params.id))
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
