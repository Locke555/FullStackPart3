require('dotenv').config()
express = require('express')
app = express()
const Person = require('./models/person')
var morgan = require('morgan')

let persons =
 [
   {
     'name': 'Arto Hellas',
     'number': '04248956312',
     'id': 1
   },
   {
     'name': 'Ada Lovelace',
     'number': '39-44-5323523',
     'id': 2
   },
   {
     'name': 'Dan Abramov',
     'number': '12-43-234345',
     'id': 3
   },
   {
     'name': 'Mary Poppendieck',
     'number': '39-23-6423122',
     'id': 4
   }
 ]

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

app.get('/api/persons', async (req, res, next) => {
  try {
    const Persons = await Person.find()
    res.json(Persons)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    console.log(id)
    const person =  await Person.findById(id)
    console.log(person)
    person === undefined ? res.status(404).end() : res.status(200).json(person)
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const { name, number } = req.body
    await Person.findByIdAndUpdate(id, { name, number }, { new: true, runValidators: true, context: 'query' })
    const newObject = await Person.findById(id)
    res.status(200).json(newObject)
  } catch (error) {
    next(error)
  }

})

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    console.log(id)
    persons = await Person.deleteOne({ _id: id })
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (req, res, next) => {
  try {
    const body = req.body
    const name = body.name
    const number = body.number
    const exist = await Person.findOne({ name: name })
    if (name === undefined || number === undefined) {
      res.status(400).json({ error: 'Name or Number not defined' })
    } else if (exist) {
      res.status(400).json({ error: 'name must be unique' })
    } else {
      const newObject = new Person({
        name: name,
        number: number
      })
      await newObject.save()
      console.log(newObject)
      res.status(201).json(newObject)
    }
  } catch (error) {
    next(error)
  }

})

app.get('/info', async (req, res, next) => {
  try {
    const number = await Person.find()
    const date = new Date()
    const html = `<p>Phonebook has info for ${number.length} people</p> <p>${date}</p>`
    res.status(200).send(html)
  } catch (error) {
    next(error)
  }
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else {
    return res.status(500).end()
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})