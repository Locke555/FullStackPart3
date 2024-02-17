require('dotenv').config()
express = require('express');
app = express();
const Person = require('./models/person');
var morgan = require('morgan')

let persons = 
 [
    {
      "name": "Arto Hellas",
      "number": "04248956312",
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
    }
  ]

morgan.token('body', (req, res) => {
 return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

app.get('/api/persons', async (req, res) => {
    const Persons = await Person.find()
    res.json(Persons)
})

app.get('/api/persons/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    const person =  await Person.findById(id)
    console.log(person)
    person === undefined ? res.status(404).end() : res.status(200).json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    persons = persons.filter(actual => actual.id !== Number(id))
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const name = body.name
    const number = body.number
    const exist = persons.some(e => e.name === name)
    if (name === undefined || number === undefined) {
      res.status(400).json({error: 'Name or Number not defined'})
    } else if (exist) {
      res.status(400).json({error: 'name must be unique' })
    } else {
    const id = Math.floor((Math.random() * 50000))
    const newObject = {
        name: name,
        number: number,
        id: id
    }
    console.log(newObject)
    persons.push(newObject)
    res.status(201).json(newObject)
    }

})

app.get('/info', async (req, res) => {
    const number = await Person.find()
    const date = new Date()
    const html = `<p>Phonebook has info for ${number.length} people</p> <p>${date}</p>`
    res.status(200).send(html)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})