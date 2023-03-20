const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('common'))

let contacts = [{ 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
    console.log('Get')
    response.send('<h1>Notes</h1>')
    })
    

app.get('/info', (request, response) => {
    console.log('Get Info')
    response.send(`<div><p>Phonebook has info for ${contacts.length} people</p><p> ${Date()} </p></div>`)
})

app.get('/api/persons', (request, response) => {
    console.log('Get Contacts')
    response.json(contacts)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const contact = contacts.find(each => each.id === Number(id))
    console.log(contact)
    contact 
    ? response.json(contact) 
    : response.status(404).json({error:'Contact Not Found'})
})

app.post('/api/persons', (request, response) => {
    console.log(request.body)
    const name = request.body.name
    const number = request.body.number

    if (!name || !number) 
        response.status(400).json({error:'Missing Parameters'})
    else if (contacts.find(each => each.name === name))
        response.status(400).json({error:'Name already exists in phonebook'})
    else {
        const id = contacts.length + 1
        const contact = {name, number, id}
        contacts = contacts.concat(contact)
        response.json(contact)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    contacts = contacts.filter(each => each.id !== Number(id))
    console.log('deleted ', id)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
