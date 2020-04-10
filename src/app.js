const express = require("express");

const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Middleware to check if the repository id exist
function checkRepoIdExist(request, response, next) {
  const { id } = request.params;

  const index = repositories.findIndex((repo) => repo.id === id);

  // Check if exist a repository with the given ID
  if (index < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  // Add index value in response to be used in the next middleware
  request.index = index;

  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checkRepoIdExist, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = request.index;

  const oldRepository = repositories[index];

  const newRepository = {
    id,
    title: title ? title : oldRepository.title,
    url: url ? url : oldRepository.url,
    techs: techs ? techs : oldRepository.techs,
    likes: oldRepository.likes,
  };

  // Update the repository
  repositories[index] = newRepository;

  return response.json(newRepository);
});

app.delete("/repositories/:id", checkRepoIdExist, (request, response) => {
  const index = request.index;

  // Remove the repository at the specifc index
  repositories.splice(index, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", checkRepoIdExist, (request, response) => {
  const index = request.index;

  const repository = repositories[index];

  // Increment likes count
  repository.likes++;

  // Update the repository with the new values
  repositories[index] = repository;

  return response.json(repository);
});

module.exports = app;
