const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.use(morgan('tiny'))
app.use(morgan(function (tokens, req, res) {
    if(req.method === 'POST' ){
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
       JSON.stringify(req.body)
    ].join(' ')}
  }))
  app.use(express.json())

let persons = [

    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
]

app.get('/', (request, response) => {

    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const generateId = () => {
    const NewId = Math.floor(Math.random() * (99999));
    return NewId
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    function findPerson(person) {
        return person.name.toLowerCase() === body.name.toLowerCase()
    }

    let alreadyAdded = persons.find(person => findPerson(person));

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    if (alreadyAdded) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }


    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.get('/info', (request, response) => {
    const date = new Date()
    const personsEntries = persons.length
    response.send(
        `<p>Phonebook has info for ${personsEntries} people</p>
         <p>${date}</p>`
    )
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
