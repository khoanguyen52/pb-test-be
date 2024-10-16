const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// app.use(
//   morgan((tokens, req, res) => {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, "content-length"),
//       "-",
//       tokens["response-time"](req, res),
//       "ms",
//       JSON.stringify(req.body),
//     ].join(" ");
//   })
// );

app.use(morgan("tiny"));

let contacts = [
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

const generateId = () => {
  return String(Math.floor(Math.random() * 1000));
};

app.get("/", (req, res) => {
  res.send("<h1> home page </h1>");
});

app.get("/api/persons/", (req, res) => {
  res.json(contacts);
});

app.get("/api/persons/info", (req, res) => {
  res.send(
    `<p>phone book has info for ${
      contacts.length
    } people </p> <p> ${new Date().toLocaleString()} </p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const filteredContact = contacts.find((n) => n.id === id);
  if (filteredContact) {
    res.json(filteredContact);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  contacts = contacts.filter((n) => n.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "gimme dat contact info",
    });
  } else if (contacts.find((n) => body.name === n.name)) {
    return res.status(400).json({
      error: "already got dat ho",
    });
  }
  const contact = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  contacts = contacts.concat(contact);
  res.json(contact);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
