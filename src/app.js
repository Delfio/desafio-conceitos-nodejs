const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  try {

    return response.json(repositories);

  } catch(err){
    return response.json(err.message);
  }
});

app.post("/repositories", (request, response) => {
  try {
    const { title, url, techs,  } = request.body;
    const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0
    }

    repositories.push(repository);

    return response.json(repository)
  } catch(er){
    return response.json(er.message);
  }
});

app.put("/repositories/:id", (request, response) => {
  try {
    const {id} = request.params;
    const {title, url, techs } = request.body;
    const indexProjeto = repositories.findIndex(prjs => prjs.id === id);
    if(indexProjeto < 0){
      return response.status(400).json({error: 'Project not found'});
    }

    const projectAntigo = repositories[indexProjeto];
    const newProject = repositories[indexProjeto]= {
      id,
      title,
      url,
      techs,
      likes: projectAntigo.likes
    }

    return response.json(newProject);
  } catch(err) {
    return response.json(err.message);
  }
});

app.delete("/repositories/:id", (request, response) => {
  try{
    const {id} = request.params;
    const projectIndex = repositories.findIndex(proj => proj.id === id);

    if(projectIndex < 0){
      return response.status(400).json({error: "Repository not found"})
    }
    repositories.splice(projectIndex, 1);

    return response.status(204).json({ok: true})
  } catch (err) {
    return response.status(400).json(err.message)
  }
});

app.post("/repositories/:id/like", (request, response) => {
  try {
    const {id} = request.params;
    if(id < 0) {
      return response.status(400).json({error: 'Like menor q 0?'});
    }

    const indexProjeto = repositories.findIndex(prjs => prjs.id === id);
    if(indexProjeto < 0){
      return response.status(400).json({error: 'Project not found'});
    }

    const projectAntigo = repositories[indexProjeto];
    const projectComLike = repositories[indexProjeto]= {
      id: projectAntigo.id,
      title: projectAntigo.title,
      url: projectAntigo.url,
      tech: projectAntigo.tech,
      likes: projectAntigo.likes +1
    }
    return response.json(projectComLike);
  } catch(err) {
    return response.status(400).json(err.message);
  }
});

module.exports = app;
