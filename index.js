const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
require("dotenv").config();
const Person = require("./models/person");

morgan.token("post-body", function (req, res) {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :post-body"
  )
);

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    const phonebookInfo = `Phonebook has info for ${persons.length} people`;
    const time = new Date().toString();

    response.send(`<p>${phonebookInfo}</p><p>${time}</p>`);
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name is required",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number is required",
    });
  }

  // if (
  //   persons.find(
  //     (person) => person.name.toLowerCase() === body.name.toLowerCase()
  //   )
  // ) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((result) => {
    response.json(person);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    console.log(person);
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
});

app.delete("/api/persons/:id", (request, response) => {
  console.log(request.params);
  Person.findByIdAndDelete(request.params.id).then((result) => {
    response.status(204).end();
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
