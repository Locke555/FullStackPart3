const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://juan:${password}@cluster0.ws2tc3q.mongodb.net/telephoneDirectory`;
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = new mongoose.model("Person", personSchema)

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name: name,
    number: number
  })
  console.log(person)
  person.save().then(result => {
    console.log(`Added ${name}, Number ${number} to Phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length === 3) {
  const persons = Person.find({}).then(result => {
    console.log("phonebook")
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}