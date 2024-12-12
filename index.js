const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

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

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  const phonebookInfo = `Phonebook has info for ${persons.length} people`;
  const time = new Date().toString();

  response.send(`<p>${phonebookInfo}</p><p>${time}</p>`);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
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

  if (
    persons.find(
      (person) => person.name.toLowerCase() === body.name.toLowerCase()
    )
  ) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: String(Math.floor(Math.random() * 99999)),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get("/api/persons/:id", (request, response) => {
  const person = persons.find((person) => person.id === request.params.id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  persons = persons.filter((person) => person.id !== request.params.id);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
