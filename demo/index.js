"use strict";
const express = require("express");

const app = express();

const jokes = ["What happens to a frog's car when it breaks down? It gets toad away",
               "Why was six scared of seven? Because seven 'ate' nine.",
               "What starts with E, ends with E, and has only 1 letter in it? Envelope :D"];

app.use(express.static("public"));

app.get("/joke", (request, response) => {
  response.setHeader("Content-Type", "text/plain");
  response.send("What happens to a frog's car when it breaks down? It gets toad away.");
});

app.get("/all", (request, response) => {
  const jokesRes = [];
  for (let i = 0; i < jokes.length; i++) {
    jokesRes.push({
      id: i,
      text: jokes[i],
    });
  }
  response.json(jokesRes);
});

app.get("/joke/:id", (request, response) => {
  const jokeID = Number(request.params.id);
  if (isNaN(jokeID) || jokeID < 0 || jokeID >= jokes.length) {
    response.setHeader("Content-Type", "text/plain;charset=utf-8");
    response.status(404);
    response.send("Joke not found 😢");
    return;
  }

  response.json({
    id: jokeID,
    text: jokes[jokeID],
  })
});

app.post("/joke", express.json(), (request, response) => {
  if (!request.body) {
    response.setHeader("Content-Type", "text/plain");
    response.status(400);
    response.send("Invalid request body");
    return;
  }

  const id = jokes.length;
  jokes.push(request.body.text);
  response.json({
    status: "We have received your joke",
    id,
    text: request.body.text,
  });
});

app.listen(3000);

console.log("Listening on http://localhost:3000/");
console.log("Press Ctrl-C to quit");