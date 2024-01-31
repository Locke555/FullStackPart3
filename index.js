express = require('express');
app = express();

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


app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    const person = persons.find(actual => actual.id === Number(id))
    console.log(person)
    person === undefined ? res.status(404).end() : res.status(200).json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    persons = persons.filter(actual => actual.id !== Number(id))
    res.status(204).end()
})

app.get('/info', (req, res) => {
    const number = persons.length
    const date = new Date()
    const html = `<p>Phonebook has info for ${number} people</p> <p>${date}</p>`
    res.status(200).send(html)
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})