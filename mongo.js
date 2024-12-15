const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Include password as argument");
  process.exit(1);
}

const password = process.argv[2];
const uri = `mongodb+srv://lguo:${password}@full-stack-open.njdwg.mongodb.net/?retryWrites=true&w=majority&appName=full-stack-open`;

mongoose.set("strictQuery", false);

mongoose.connect(uri);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// List all persons
if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log("Phonebook");
    persons.map((person) => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
}

// Add new person
else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(() => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
