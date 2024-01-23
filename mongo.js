const mongoose = require('mongoose')

if (process.argv.length<3 || process.argv.length===4) {
  console.log('Use of arguments: Ex: node mongo.js password, will find saved data')
  console.log('Use of arguments: Ex: node mongo.js password name number, will find save a new record with data given. Remember to use "" when name contains a space')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.qf2rovi.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})

if (process.argv.length===5) {

  person.save().then(() => {
    console.log('person saved!')
    mongoose.connection.close()
  })
} else {

  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}