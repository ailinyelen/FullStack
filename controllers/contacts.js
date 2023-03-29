const router = require('express').Router()
const Contact = require('../models/contact')


router.get('', (request, response, next) =>
    Contact.find({}).then(result => response.json(result))
)

router.get('/:id', (request, response) =>
    Contact
        .findById(request.params.id)
        .then(contact => {
            console.log(contact)
            contact
                ? response.json(contact)
                : response.status(404).json({ error: 'Contact Not Found' })
        })
        .catch(error => next(error))
)

router.post('', (request, response, next) => {
    const contact = new Contact(request.body)
    contact
        .save()
        .then(() => {
            console.log(`added ${contact.name} number ${contact.number} to phonebook`)
            response.json(contact)
        })
        .catch(error => next(error))
})

router.put(':id', (request, response, next) => {
    const contact = request.body
    Contact
        .updateOne({ name: contact.name }, { $set: { number: contact.number } }, { runValidators: true })
        .then(result => {
            console.log(result)
            console.log(`updated number ${contact.number} for: ${contact.name} to phonebook`)
            response.end()
        })
        .catch(error => next(error))

})

router.delete('/:id', (request, response) =>
    Contact
        .findByIdAndDelete(request.params.id)
        .then(result => {
            console.log('result: ', result)
            response.status(204).end()
        })
)

module.exports = router